import api from "../api/axios";
import type { SignupData, LoginData } from "../types/types";

export const registerAPI = async (data: SignupData) => {
  try {
    const res = await api.post("/api/auth/register", data);
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Registartion Failed");
  }
};

export const loginAPI = async (data: LoginData) => {
  try {
    const res = await api.post("/api/auth/login", data);
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.messages || "Login failed");
  }
};
