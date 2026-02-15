import { registerAPI, loginAPI } from "../../api/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { LoginData, SignupData } from "../../types/types";

export const loginThunk = createAsyncThunk(
  "user/login",
  async (data: LoginData) => {
    const response = await loginAPI(data);
    return response;
  },
);

export const registerThunk = createAsyncThunk(
  "user/register",
  async (data: SignupData) => {
    const response = await registerAPI(data);
    return response;
  },
);

export const logoutThunk = createAsyncThunk("user/logout", async () => {
  // clear persistent storage
  localStorage.removeItem("token");
  localStorage.removeItem("user");
});
