import apiClient from "./apiClient";
import { AxiosError } from "axios";

export const registerApi = async (formData: FormData) => {
  try {
    const response = await apiClient.post("/user", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return { success: true, data: response.data };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        message: error.response?.data?.message || "Lỗi trong quá trình đăng kí",
      };
    }
    return {
      success: false,
      message: "Lỗi trong quá trình đăng kí",
    };
  }
};

export const loginApi = async (user: { email: string; password: string }) => {
  const response = await apiClient.post("/auth", {
    email: user.email,
    password: user.password,
  });
  return response;
};

export const loginWithGoogleApi = async (token: string) => {
  const response = await apiClient.post("/auth/firebase", token);
  return response;
};
