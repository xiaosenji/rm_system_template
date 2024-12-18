import { http } from "@/utils/http";
import type {
  ApiResponse,
  RegisterRequest,
  LoginRequest,
  AuthResponse
} from "../types";

/** User registration */
export const register = (data: RegisterRequest) => {
  return http.request<ApiResponse<AuthResponse>>("post", "/api/auth/register", {
    data
  });
};

/** User login */
export const login = (data: LoginRequest) => {
  return http.request<ApiResponse<AuthResponse>>("post", "/api/auth/login", {
    data
  });
};

/** Get verification code */
export const getVerifyCode = (tel: string) => {
  return http.request<ApiResponse<void>>("get", `/api/auth/verify-code/${tel}`);
};
