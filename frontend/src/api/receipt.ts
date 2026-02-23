import api from "./axios";
import axios from "axios";

interface ScanReceiptResponseItem {
  name?: string;
  quantity?: number;
  unit?: string;
  minQuantity?: number;
  expiryDate?: string;
}

interface ScanReceiptResponse {
  success: boolean;
  items: ScanReceiptResponseItem[];
  receiptUrl?: string;
  message?: string;
  error?: string;
}

export const scanReceiptApi = async (
  formData: FormData,
): Promise<ScanReceiptResponse> => {
  try {
    const response = await api.post("/api/receipt/scan", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to scan receipt";
      throw new Error(message);
    }
    throw new Error("Failed to scan receipt");
  }
};
