/**
 * @fileoverview RTK Query API slice for User Management.
 * Provides live endpoints for listing, inspecting, suspending, and deleting users,
 * with automated cache invalidation using 'Users' tags.
 */
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/api/baseQuery';
import type {
  UserListResponse,
  UserDetailResponse,
  GetUsersListRequest,
  GetUserByIdRequest,
  SuspendUserRequest,
  SuspendUserResponse,
  DeleteUserRequest,
  UserApiResponse,
} from '@/features/users/types/userTypes';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    /**
     * Fetch paginated users list with optional search query.
     * GET /admin/users?offset=0&limit=10&search=...
     */
    getUsersList: builder.query<UserListResponse, GetUsersListRequest | void>({
      query: (params = {}) => ({
        url: '/admin/users',
        method: 'GET',
        params: {
          offset: params?.offset ?? 0,
          limit: params?.limit ?? 10,
          search: params?.search ?? undefined,
        },
      }),
      transformResponse: (response: UserApiResponse<UserListResponse>) => {
        return response.response;
      },
      providesTags: (result) =>
        result && result.users
          ? [
              ...result.users.map(({ id }) => ({ type: 'Users' as const, id })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),

    /**
     * Fetch user details by ID including profile and stats.
     * GET /admin/users/{userId}
     */
    getUserById: builder.query<UserDetailResponse, GetUserByIdRequest>({
      query: ({ userId }) => ({
        url: `/admin/users/${userId}`,
        method: 'GET',
      }),
      transformResponse: (response: UserApiResponse<UserDetailResponse>) => {
        return response.response;
      },
      providesTags: (_result, _error, arg) => [{ type: 'Users', id: arg.userId }],
    }),

    /**
     * Suspend or unsuspend a user.
     * PUT /admin/users/{userId}/suspend
     */
    suspendUser: builder.mutation<SuspendUserResponse, SuspendUserRequest>({
      query: ({ userId, isSuspended }) => ({
        url: `/admin/users/${userId}/suspend`,
        method: 'PUT',
        data: { isSuspended },
      }),
      transformResponse: (response: UserApiResponse<SuspendUserResponse>) => {
        return response.response;
      },
      invalidatesTags: (_result, _error, arg) => [
        { type: 'Users', id: arg.userId },
        { type: 'Users', id: 'LIST' },
      ],
    }),

    /**
     * Delete a user by ID.
     * DELETE /admin/users/{userId}
     */
    deleteUser: builder.mutation<void, DeleteUserRequest>({
      query: ({ userId }) => ({
        url: `/admin/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetUsersListQuery,
  useGetUserByIdQuery,
  useSuspendUserMutation,
  useDeleteUserMutation,
} = userApi;
