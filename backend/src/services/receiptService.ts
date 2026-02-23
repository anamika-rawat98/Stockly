import { PutObjectCommand } from "@aws-sdk/client-s3";
import { ConverseCommand } from "@aws-sdk/client-bedrock-runtime";
import { s3Client, bedrockClient } from "../config/awsConfig";

interface ScannedItem {
  name: string;
  quantity: number;
  unit: string;
  expiryDate: string | null;
}

interface ScanReceiptResult {
  items: ScannedItem[];
  receiptUrl: string;
}

const mimeToBedrockFormat: Record<string, "jpeg" | "png" | "gif" | "webp"> = {
  "image/jpeg": "jpeg",
  "image/jpg": "jpeg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
};

export const scanReceipt = async (
  file: Express.Multer.File,
): Promise<ScanReceiptResult> => {
  const bucketName = process.env.S3_BUCKET_NAME?.trim();
  const modelId = process.env.BEDROCK_MODEL_ID?.trim();

  if (!bucketName) {
    throw new Error("Missing S3_BUCKET_NAME in backend/.env");
  }

  if (!modelId) {
    throw new Error("Missing BEDROCK_MODEL_ID in backend/.env");
  }

  // 1. Upload the receipt to S3
  const fileName = `receipts/${Date.now()}-${file.originalname}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    }),
  );

  // 2. Send image to Bedrock using ConverseCommand
  const format = mimeToBedrockFormat[file.mimetype];
  if (!format) {
    throw new Error(
      `Unsupported image format: ${file.mimetype}. Use jpeg, png, gif, or webp.`,
    );
  }

  let extractedText = "";
  try {
    const bedrockResponse = await bedrockClient.send(
      new ConverseCommand({
        modelId,
        messages: [
          {
            role: "user" as const,
            content: [
              {
                image: {
                  format,
                  source: {
                    bytes: file.buffer,
                  },
                },
              },
              {
                text: `Please scan this grocery receipt and extract all items.
              Return ONLY a JSON array, no extra text, in this exact format:
              [
                {
                  "name": "Milk",
                  "quantity": 2,
                  "unit": "L",
                  "expiryDate": null
                }
              ]
              If you cannot determine unit, use "pcs".
              If you cannot determine quantity, use 1.
              If expiry date is on receipt use it, otherwise set null.`,
              },
            ],
          },
        ],
        inferenceConfig: {
          maxTokens: 1000,
        },
      }),
    );

    extractedText = bedrockResponse.output?.message?.content?.[0]?.text ?? "";
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Bedrock request failed: ${errorMessage}`);
  }

  // 3. Parse Bedrock response
  const normalizedText = extractedText.trim();
  const jsonFromCodeBlock = normalizedText.match(
    /```(?:json)?\s*([\s\S]*?)\s*```/i,
  )?.[1];
  const jsonPayload = (jsonFromCodeBlock ?? normalizedText).trim();

  let items: ScannedItem[];
  try {
    items = JSON.parse(jsonPayload);
  } catch {
    throw new Error(`Bedrock returned invalid JSON: ${normalizedText}`);
  }

  if (!Array.isArray(items)) {
    throw new Error("Bedrock response is not a JSON array");
  }

  return {
    items,
    receiptUrl: `https://${bucketName}.s3.amazonaws.com/${fileName}`,
  };
};
