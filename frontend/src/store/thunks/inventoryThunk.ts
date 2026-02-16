import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getInventoryApi,
  addInventoryApi,
  updateInventoryApi,
  deleteInventoryApi,
} from "../../api/inventory";
import type { InventoryData } from "../../types/types";

export const getInventoryThunk = createAsyncThunk(
  "inventory/getAll",
  async (_, { rejectWithValue }) => {
    try {
      return await getInventoryApi();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const addInventoryThunk = createAsyncThunk(
  "inventory/add",
  async (data: InventoryData, { rejectWithValue }) => {
    try {
      return await addInventoryApi(data);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateInventoryThunk = createAsyncThunk(
  "inventory/update",
  async (
    { id, data }: { id: string; data: Partial<InventoryData> },
    { rejectWithValue },
  ) => {
    try {
      return await updateInventoryApi(id, data);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const deleteInventoryThunk = createAsyncThunk(
  "inventory/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteInventoryApi(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);
