import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/userSlice";
import inventoryReducer from "./slice/inventorySlice";
import shoppingReducer from "./slice/shoppingSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    inventory: inventoryReducer,
    shopping: shoppingReducer,
  },
});

export type StoreState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
