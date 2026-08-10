/**
 * @fileoverview RTK Query API slice for Push Notifications.
 * Provides endpoints to send push notifications and fetch notification history,
 * with automated cache invalidation on new broadcasts.
 */
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/api/baseQuery';
import type {
  SendPushNotificationRequest,
  SendPushNotificationResponse,
  NotificationHistoryResponse,
  GetNotificationHistoryRequest,
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
     * Fetch paginated notification history.
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
        return response.response;
      },
      providesTags: ['NotificationHistory'],
    }),

    /**
     * Fetch users for the picker.
     * GET /admin/users/picker?offset=0&limit=5
     */
    getUsersPicker: builder.query<
      import('../types/notificationApiTypes').UsersPickerResponse,
      import('../types/notificationApiTypes').GetUsersPickerRequest | void
    >({
      query: (params = {}) => ({
        url: '/admin/users/picker',
        method: 'GET',
        params: {
          offset: params?.offset ?? 0,
          limit: params?.limit ?? 10,
        },
      }),
      transformResponse: (response: NotificationApiResponse<import('../types/notificationApiTypes').UsersPickerResponse>) => {
        return response.response;
      },
    }),
  }),
});

export const {
  useSendPushNotificationMutation,
  useGetNotificationHistoryQuery,
  useGetUsersPickerQuery,
} = notificationApi;
