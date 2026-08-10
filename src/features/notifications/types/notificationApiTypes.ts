/**
 * @fileoverview API types for Push Notification domain.
 * Mirrors the response schemas from Admin.postman_collection (1).json.
 */

export interface SendPushNotificationRequest {
  title: string;
  body: string;
  image?: string;
  isAllUser: boolean;
  users?: number[];
}

export interface SendPushNotificationResponse {
  success: boolean;
  message?: string;
}

export interface NotificationHistoryApiItem {
  id: number;
  title: string;
  body: string;
  image: string | null;
  isAllUser: boolean;
  sentAt: string;
  recipientsCount: number;
}

export interface NotificationHistoryResponse {
  notifications: NotificationHistoryApiItem[];
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
  }>;
  pagination?: {
    offset: number;
    limit: number;
    total?: number;
  };
}
