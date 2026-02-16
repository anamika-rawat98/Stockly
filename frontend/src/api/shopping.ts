import api from "./axios";
import type {
  ShoppingData,
  ShoppingResponseData,
  PurchaseItemData,
} from "../types/types";

// Get all shopping items
export const getShoppingApi = async (): Promise<ShoppingResponseData[]> => {
  try {
    const response = await api.get("/api/shopping");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch shopping list",
    );
  }
};

// Add item (manually or from inventory)
export const addShoppingApi = async (
  data: ShoppingData,
): Promise<ShoppingResponseData> => {
  try {
    const response = await api.post("/api/shopping", data);
    return response.data.data; // backend returns { data: item, message: "..." }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to add item");
  }
};

// Update shopping item
export const updateShoppingApi = async (
  id: string,
  data: { name: string; quantity: number; unit: string },
): Promise<ShoppingResponseData> => {
  try {
    const response = await api.put(`/api/shopping/${id}`, data);
    return response.data.item; // backend returns { item: updatedItem, message: "..." }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update item");
  }
};

// Move to inventory (purchased)
export const purchaseShoppingApi = async (
  id: string,
  data: PurchaseItemData,
): Promise<void> => {
  try {
    await api.delete(`/api/shopping/${id}`, {
      data: { ...data, ismoving: true }, // ismoving: true → moves to inventory
    });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to purchase item");
  }
};

// Just delete (no moving to inventory)
export const deleteShoppingApi = async (id: string): Promise<void> => {
  try {
    await api.delete(`/api/shopping/${id}`, {
      data: { ismoving: false }, // ismoving: false → just deletes
    });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete item");
  }
};
