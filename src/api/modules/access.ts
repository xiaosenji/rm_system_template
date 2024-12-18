import { http } from "@/utils/http";
import type {
  ApiResponse,
  AccessCreateRequest,
  AccessRequest,
  PendingApproval,
  ProcessApprovalRequest,
  ApprovalResult,
  PaginationResponse,
  AccessRecordListParams,
  AccessRecord
} from "../types";

/** Create access request */
export const createAccessRequest = (data: AccessCreateRequest) => {
  return http.request<ApiResponse<{ requestId: number }>>(
    "post",
    "/api/access/create",
    { data }
  );
};

/** Get access request list */
export const getAccessList = (params: {
  pageNum: number;
  pageSize: number;
  status?: string;
}) => {
  return http.request<ApiResponse<PaginationResponse<AccessRequest>>>(
    "get",
    "/api/access/list",
    { params }
  );
};

/** Cancel access request */
export const cancelAccessRequest = (requestId: number) => {
  return http.request<ApiResponse<void>>(
    "post",
    `/api/access/cancel/${requestId}`
  );
};

/** Get pending approval list */
export const getPendingApprovals = (params: {
  pageNum: number;
  pageSize: number;
}) => {
  return http.request<ApiResponse<PaginationResponse<PendingApproval>>>(
    "get",
    "/api/approval/pending",
    { params }
  );
};

/** Process approval */
export const processApproval = (data: ProcessApprovalRequest) => {
  return http.request<ApiResponse<{ accessCode?: string }>>(
    "post",
    "/api/approval/process",
    { data }
  );
};

/** Get approval results */
export const getApprovalResults = (params: {
  pageNum: number;
  pageSize: number;
}) => {
  return http.request<ApiResponse<PaginationResponse<ApprovalResult>>>(
    "get",
    "/api/approval/results",
    { params }
  );
};

/** Get access records list */
export const getAccessRecords = (params: AccessRecordListParams) => {
  return http.request<ApiResponse<PaginationResponse<AccessRecord>>>(
    "get",
    "/api/access/records",
    { params }
  );
};
