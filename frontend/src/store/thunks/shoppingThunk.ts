import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getShoppingApi,
  addShoppingApi,
  updateShoppingApi,
  purchaseShoppingApi,
  deleteShoppingApi,
} from "../../api/shopping";
import type { ShoppingData, PurchaseItemData } from "../../types/types";

// Get all shopping items
export const getShoppingThunk = createAsyncThunk(
  "shopping/getAll",
  async (_, { rejectWithValue }) => {
    try {
      return await getShoppingApi();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

// Add item (manually or from inventory)
export const addShoppingThunk = createAsyncThunk(
  "shopping/add",
  async (data: ShoppingData, { rejectWithValue }) => {
    try {
      return await addShoppingApi(data);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

// Update shopping item
export const updateShoppingThunk = createAsyncThunk(
  "shopping/update",
  async (
    {
      id,
      data,
    }: { id: string; data: { name: string; quantity: number; unit: string } },
    { rejectWithValue },
  ) => {
    try {
      return await updateShoppingApi(id, data);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

// Mark as purchased → moves to inventory
export const purchaseShoppingThunk = createAsyncThunk(
  "shopping/purchase",
  async (
    { id, data }: { id: string; data: PurchaseItemData },
    { rejectWithValue },
  ) => {
    try {
      await purchaseShoppingApi(id, data);
      return id; // return id to remove from state
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

// Just delete from shopping list
export const deleteShoppingThunk = createAsyncThunk(
  "shopping/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteShoppingApi(id);
      return id; // return id to remove from state
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);
