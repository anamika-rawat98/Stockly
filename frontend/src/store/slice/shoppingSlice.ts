import { createSlice } from "@reduxjs/toolkit";
import {
  getShoppingThunk,
  addShoppingThunk,
  updateShoppingThunk,
  purchaseShoppingThunk,
  deleteShoppingThunk,
} from "../thunks/shoppingThunk";
import type { ShoppingResponseData } from "../../types/types";

type ShoppingState = {
  items: ShoppingResponseData[];
  isLoading: boolean;
  error: string | null;
};

const initialState: ShoppingState = {
  items: [],
  isLoading: false,
  error: null,
};

const shoppingSlice = createSlice({
  name: "shopping",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Get all
    builder
      .addCase(getShoppingThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getShoppingThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(getShoppingThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Add
    builder
      .addCase(addShoppingThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addShoppingThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.push(action.payload);
      })
      .addCase(addShoppingThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update
    builder
      .addCase(updateShoppingThunk.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item._id === action.payload._id,
        );
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(updateShoppingThunk.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Purchase → remove from list
    builder
      .addCase(purchaseShoppingThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(purchaseShoppingThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter((item) => item._id !== action.payload);
      })
      .addCase(purchaseShoppingThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete → remove from list
    builder
      .addCase(deleteShoppingThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      })
      .addCase(deleteShoppingThunk.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});
export const { clearError } = shoppingSlice.actions;
export default shoppingSlice.reducer;
