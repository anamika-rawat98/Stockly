import { createSlice } from "@reduxjs/toolkit";
import {
  getInventoryThunk,
  addInventoryThunk,
  updateInventoryThunk,
  deleteInventoryThunk,
} from "../thunks/inventoryThunk";
import type { InventoryResponseData } from "../../types/types";

type InventoryState = {
  items: InventoryResponseData[];
  isLoading: boolean;
  error: string | null;
};

const initialState: InventoryState = {
  items: [],
  isLoading: false,
  error: null,
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Get all
    builder
      .addCase(getInventoryThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getInventoryThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(getInventoryThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Add
    builder
      .addCase(addInventoryThunk.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      .addCase(addInventoryThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update
    builder
      .addCase(updateInventoryThunk.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item._id === action.payload._id,
        );
        if (index !== -1) state.items[index] = action.payload;
      })

      .addCase(updateInventoryThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete
    builder
      .addCase(deleteInventoryThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      })
      .addCase(deleteInventoryThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});
export const { clearError } = inventorySlice.actions;
export default inventorySlice.reducer;
