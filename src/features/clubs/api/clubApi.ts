/**
 * @fileoverview RTK Query API slice for Club Management.
 * Provides live endpoints for listing, inspecting, suspending, and deleting clubs,
 * with automated cache invalidation using 'Clubs' tags.
 */
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/api/baseQuery';
import type {
  ClubListResponse,
  ClubDetailResponse,
  GetClubsListRequest,
  GetClubByIdRequest,
  SuspendClubRequest,
  DeleteClubRequest,
  ClubApiResponse,
} from '@/features/clubs/types/clubTypes';

export const clubApi = createApi({
  reducerPath: 'clubApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Clubs'],
  endpoints: (builder) => ({
    /**
     * Fetch paginated clubs list with optional search query.
     * GET /admin/clubs?offset=0&limit=10&search=...
     */
    getClubsList: builder.query<ClubListResponse, GetClubsListRequest | void>({
      query: (params = {}) => ({
        url: '/admin/clubs',
        method: 'GET',
        params: {
          offset: params?.offset ?? 0,
          limit: params?.limit ?? 10,
          search: params?.search ?? undefined,
        },
      }),
      transformResponse: (response: ClubApiResponse<ClubListResponse>) => {
        return response.response;
      },
      providesTags: (result) =>
        result && result.clubs
          ? [
              ...result.clubs.map(({ id }) => ({ type: 'Clubs' as const, id })),
              { type: 'Clubs', id: 'LIST' },
            ]
          : [{ type: 'Clubs', id: 'LIST' }],
    }),

    /**
     * Fetch club details by ID including profile and stats.
     * GET /admin/clubs/{clubId}?tab=members&limit=5&offset=0
     */
    getClubById: builder.query<ClubDetailResponse, GetClubByIdRequest>({
      query: ({ clubId, tab = 'members', limit = 10, offset = 0 }) => ({
        url: `/admin/clubs/${clubId}`,
        method: 'GET',
        params: { tab, limit, offset },
      }),
      transformResponse: (response: ClubApiResponse<ClubDetailResponse>) => {
        return response.response;
      },
      providesTags: (_result, _error, arg) => [{ type: 'Clubs', id: arg.clubId }],
    }),

    /**
     * Suspend or unsuspend a club.
     * PUT /admin/clubs/{clubId}/suspend
     */
    suspendClub: builder.mutation<void, SuspendClubRequest>({
      query: ({ clubId, isSuspended }) => ({
        url: `/admin/clubs/${clubId}/suspend`,
        method: 'PUT',
        data: { isSuspended },
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: 'Clubs', id: arg.clubId },
        { type: 'Clubs', id: 'LIST' },
      ],
    }),

    /**
     * Delete a club by ID.
     * DELETE /admin/clubs/{clubId}
     */
    deleteClub: builder.mutation<void, DeleteClubRequest>({
      query: ({ clubId }) => ({
        url: `/admin/clubs/${clubId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Clubs', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetClubsListQuery,
  useGetClubByIdQuery,
  useSuspendClubMutation,
  useDeleteClubMutation,
} = clubApi;
