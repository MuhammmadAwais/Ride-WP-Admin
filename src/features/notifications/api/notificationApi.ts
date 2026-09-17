/**
 * @fileoverview RTK Query API slice for Push Notifications.
 * Provides endpoints to send push notifications, fetch notification history logs,
 * and query lightweight user pickers with automated cache invalidation.
 */
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/api/baseQuery';
import type {
  SendPushNotificationRequest,
  SendPushNotificationResponse,
  NotificationHistoryResponse,
  GetNotificationHistoryRequest,
  GetUsersPickerRequest,
  UsersPickerResponse,
  NotificationApiResponse,
} from '@/features/notifications/types/notificationApiTypes';

export const notificationApi = createApi({
  reducerPath: 'notificationApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['NotificationHistory'],
  endpoints: (builder) => ({
    /**
     * Send a broadcast or targeted push notification.
     * POST /admin/notifications/send
     */
    sendPushNotification: builder.mutation<
      SendPushNotificationResponse,
      SendPushNotificationRequest
    >({
      query: (body) => ({
        url: '/admin/notifications/send',
        method: 'POST',
        data: body,
      }),
      transformResponse: (response: NotificationApiResponse<SendPushNotificationResponse>) => {
        return response.response || { success: true };
      },
      invalidatesTags: ['NotificationHistory'],
    }),

    /**
     * Fetch paginated notification history audit logs.
     * GET /admin/notifications/history?offset=0&limit=10
     */
    getNotificationHistory: builder.query<
      NotificationHistoryResponse,
      GetNotificationHistoryRequest | void
    >({
      query: (params = {}) => ({
        url: '/admin/notifications/history',
        method: 'GET',
        params: {
          offset: params?.offset ?? 0,
          limit: params?.limit ?? 10,
        },
      }),
      transformResponse: (response: NotificationApiResponse<NotificationHistoryResponse>) => {
        const data = response.response;
        const list = data?.history || data?.notifications || [];
        return {
          history: list,
          notifications: list,
          pagination: data?.pagination,
        };
      },
      providesTags: ['NotificationHistory'],
    }),

    /**
     * Fetch users for the recipient picker.
     * GET /admin/users/picker?limit=50&offset=0&search=...
     */
    getUsersPicker: builder.query<UsersPickerResponse, GetUsersPickerRequest | void>({
      query: (params = {}) => ({
        url: '/admin/users/picker',
        method: 'GET',
        params: {
          offset: params?.offset ?? 0,
          limit: params?.limit ?? 50,
          ...(params?.search ? { search: params.search } : {}),
        },
      }),
      transformResponse: (response: NotificationApiResponse<UsersPickerResponse>) => {
        return response.response || { users: [] };
      },
    }),
  }),
});

export const {
  useSendPushNotificationMutation,
  useGetNotificationHistoryQuery,
  useGetUsersPickerQuery,
} = notificationApi;
