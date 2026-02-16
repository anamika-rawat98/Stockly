import api from "./axios";
import type { InventoryData, InventoryResponseData } from "../types/types";

// Get all items
export const getInventoryApi = async (): Promise<InventoryResponseData[]> => {
  try {
    const response = await api.get("/api/inventory");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch inventory",
    );
  }
};

// Add item
export const addInventoryApi = async (
  data: InventoryData,
): Promise<InventoryResponseData> => {
  try {
    const response = await api.post("/api/inventory", data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to add item");
  }
};

// Update item
export const updateInventoryApi = async (
  id: string,
  data: Partial<InventoryData>,
): Promise<InventoryResponseData> => {
  try {
    const response = await api.put(`/api/inventory/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update item");
  }
};

// Delete item
export const deleteInventoryApi = async (id: string): Promise<void> => {
  try {
    await api.delete(`/api/inventory/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete item");
  }
};
