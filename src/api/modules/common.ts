import { http } from "@/utils/http";
import type { ApiResponse } from "../types";

/** Get regions list */
export const getRegions = () => {
  return http.request<ApiResponse<string[]>>("get", "/api/common/regions");
};

/** Get centers list */
export const getCenters = (region: string) => {
  return http.request<ApiResponse<string[]>>("get", "/api/common/centers", {
    params: { region }
  });
};
