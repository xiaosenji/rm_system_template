// Common response type
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// Auth types
export interface RegisterRequest {
  username: string;
  nickname: string;
  password: string;
  tel: string;
  verifyCode: string;
}

export interface UserInfo {
  username: string;
  nickname: string;
  tel: string;
  permissions: string;
  deptName: string;
}

export interface AuthResponse {
  token: string;
  userInfo: UserInfo;
}

export type LoginRequest = {
  account: string;
  password: string;
  verifyCode: string;
};

// Room types
export interface RoomCreateRequest {
  roomRegion: string;
  roomCenter: string;
  roomName: string;
  managerName: string;
  managerPhone: string;
  backupManagerName: string;
  backupManagerPhone: string;
  remarks: string;
}

export interface RoomListParams {
  pageNum: number;
  pageSize: number;
  roomRegion?: string;
  roomCenter?: string;
}

export interface RoomDetail {
  roomId: number;
  roomRegion: string;
  roomCenter: string;
  roomName: string;
  managerName: string;
  backupManagerName: string;
  lockDeviceFlag: boolean;
  lockDeviceSn?: string;
  managerPhone: string;
  backupManagerPhone: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  createdByName: string;
  updatedByName: string;
}

export interface RoomManager {
  userId: number;
  nickname: string;
  tel: string;
}

// Access types
export interface AccessCreateRequest {
  roomId: number;
  contact: string;
  requestType: string;
  visitPurpose: string;
  plannedEntryTime: string;
  plannedExitTime: string;
  purposeDescription?: string;
}

export interface AccessRequest {
  requestId: number;
  applicantName: string;
  contact: string;
  roomName: string;
  requestType: string;
  visitPurpose: string;
  plannedEntryTime: string;
  plannedExitTime: string;
  requestStatus: string;
  accessCode?: string;
  purposeDescription?: string;
  approvalRemarks?: string;
}

export interface PendingApproval {
  requestId: number;
  applicantName: string;
  contact: string;
  roomName: string;
  requestType: string;
  visitPurpose: string;
  plannedEntryTime: string;
  plannedExitTime: string;
  purposeDescription?: string;
}

export interface ProcessApprovalRequest {
  requestId: number;
  approvalResult: string;
  approvalRemarks?: string;
}

export interface ApprovalResult {
  approvalId: number;
  applicantName: string;
  approverName: string;
  approvalResult: string;
  approvalRemarks?: string;
  createdAt: string;
  requestDetails: {
    contact: string;
    roomName: string;
    requestType: string;
    visitPurpose: string;
    plannedEntryTime: string;
    plannedExitTime: string;
    purposeDescription?: string;
  };
}

// Pagination response type
export interface PaginationResponse<T> {
  total: number;
  list: T[];
}

// Access Record type
export interface AccessRecordListParams {
  pageNum: number;
  pageSize: number;
  startTime?: string;
  endTime?: string;
}

export interface AccessRecord {
  recordId: number;
  approvalId: number;
  visitTime: string;
  requestId: number;
  applicantName: string;
  roomName: string;
  requestType: string;
  visitPurpose: string;
  plannedEntryTime: string;
  plannedExitTime: string;
  accessStatus: string;
}
