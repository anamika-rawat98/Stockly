import express, { Request, Response } from "express";
import multer from "multer";
import { scanReceipt } from "../services/receiptService";

const router = express.Router();

// Store file in memory temporarily
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: (_req, file, cb) => {
    // Only allow images
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

// POST /api/receipt/scan
router.post(
  "/scan",
  upload.single("receipt"),
  async (req: Request, res: Response) => {
    try {
      // Check if file was uploaded
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: "No receipt image provided",
        });
        return;
      }

      // Scan receipt using S3 + Bedrock
      const result = await scanReceipt(req.file);

      res.status(200).json({
        success: true,
        items: result.items,
        receiptUrl: result.receiptUrl,
      });
    } catch (error) {
      console.error("Receipt scan error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({
        success: false,
        message: "Failed to scan receipt",
        error: errorMessage,
      });
    }
  },
);

export default router;
