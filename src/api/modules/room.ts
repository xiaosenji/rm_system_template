import { http } from "@/utils/http";
import type {
  ApiResponse,
  RoomCreateRequest,
  RoomListParams,
  RoomDetail,
  RoomManager,
  PaginationResponse
} from "../types";

/** Create room */
export const createRoom = (data: RoomCreateRequest) => {
  return http.request<ApiResponse<{ roomId: number }>>(
    "post",
    "/api/room/create",
    { data }
  );
};

/** Get room list */
export const getRoomList = (params: RoomListParams) => {
  return http.request<ApiResponse<PaginationResponse<RoomDetail>>>(
    "get",
    "/api/room/list",
    { params }
  );
};

/** Update room */
export const updateRoom = (roomId: number, data: RoomCreateRequest) => {
  return http.request<ApiResponse<void>>("put", `/api/room/${roomId}`, {
    data
  });
};

/** Delete room */
export const deleteRoom = (roomId: number) => {
  return http.request<ApiResponse<void>>("delete", `/api/room/${roomId}`);
};

/** Get room managers */
export const getRoomManagers = (region: string) => {
  return http.request<ApiResponse<RoomManager[]>>("get", "/api/room/managers", {
    params: { region }
  });
};
