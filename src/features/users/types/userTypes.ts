/**
 * @fileoverview TypeScript interfaces and types for User Management API slice.
 * Mirrors the response schemas from Admin.postman_collection (1).json for User Management.
 */

export interface UserListItem {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  profileImage: string | null;
  isSuspended: boolean;
  clubsJoined: number;
  subscriptionPlan: string;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
}

export interface PaginationInfo {
  total?: number;
  offset: number;
  limit: number;
}

export interface UserListResponse {
  users: UserListItem[];
  pagination?: PaginationInfo;
}

export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  profileImage: string | null;
  isSuspended: boolean;
  subscriptionPlan: string;
  startDate: string | null;
  endDate: string | null;
  clubsJoined: number;
}

export interface UserStats {
  totalRides: number;
  distanceCovered: string;
  userReputation: string;
}

export interface UserDetailResponse {
  profile: UserProfile;
  stats: UserStats;
  rides?: unknown[];
  clubs?: unknown[];
  listings?: unknown[];
  purchases?: unknown[];
}

export interface GetUsersListRequest {
  offset?: number;
  limit?: number;
  search?: string;
}

export interface GetUserByIdRequest {
  userId: number;
}

export interface SuspendUserRequest {
  userId: number;
  isSuspended: boolean;
}

export interface SuspendUserResponse {
  id: number;
  fullName: string;
  isSuspended: boolean;
}

export interface DeleteUserRequest {
  userId: number;
}

export interface UserApiResponse<T> {
  statusCode: number;
  message: string;
  response: T;
}
