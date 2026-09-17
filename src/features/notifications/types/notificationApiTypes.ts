/**
 * @fileoverview API types for Push Notification domain.
 * Mirrors the request and response schemas from Admin.postman_collection.json.
 */

export interface SendPushNotificationRequest {
  title: string;
  body: string;
  targetSegment?: 'all' | 'specific';
  userIds?: number[];
  imageUrl?: string;
  // Compatibility fields with legacy payloads:
  isAllUser?: boolean;
  users?: number[];
  image?: string;
}

export interface SendPushNotificationResponse {
  success?: boolean;
  logId?: number;
  recipientsCount?: number;
  status?: string;
  message?: string;
}

export interface NotificationHistoryApiItem {
  id: number;
  title: string;
  body: string;
  targetSegment?: 'all' | 'specific' | string;
  imageUrl?: string | null;
  image?: string | null;
  status?: 'DELIVERED' | 'FAILED' | string;
  recipientsCount?: number;
  createdAt?: string;
  sentAt?: string;
  isAllUser?: boolean;
}

export interface NotificationHistoryResponse {
  history?: NotificationHistoryApiItem[];
  notifications?: NotificationHistoryApiItem[];
  pagination?: {
    offset: number;
    limit: number;
    total?: number;
  };
}

export interface GetNotificationHistoryRequest {
  offset?: number;
  limit?: number;
}

export interface NotificationApiResponse<T> {
  statusCode: number;
  message: string;
  response: T;
}

export interface GetUsersPickerRequest {
  offset?: number;
  limit?: number;
  search?: string;
}

export interface UsersPickerResponse {
  users: Array<{
    id: number;
    fullName: string;
    profileImage: string | null;
    email?: string;
  }>;
  pagination?: {
    offset: number;
    limit: number;
    total?: number;
  };
}
