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

export interface UserRide {
  id: number;
  dateTime: string;
  route: string;
  hostName: string;
  status: string;
  distance: string | null;
  pace: string | null;
  participantsCount: number;
  rideName: string;
  gpxFile: string | null;
}

export interface UserClub {
  id: number;
  clubName: string;
  memberCount: string;
  role: string;
  joinedDate: string;
}

export interface UserListing {
  id: number;
  productName: string;
  price: string;
  condition: string;
  image: string | null;
  description: string;
  isActive: boolean;
  isSoldOut: boolean;
  quantity: number | null;
  createdAt: string;
}

export interface UserPurchase {
  id: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface UserDetailResponse {
  profile: UserProfile;
  stats: UserStats;
  rides?: UserRide[];
  clubs?: UserClub[];
  listings?: UserListing[];
  purchases?: UserPurchase[];
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
