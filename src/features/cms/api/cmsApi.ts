/**
 * @fileoverview RTK Query API slice for System Content (CMS).
 * Handles fetching and updating dynamic platform pages (About, Privacy, Terms)
 * with tag invalidation per content type.
 */
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/api/baseQuery';
import type {
  CMSContentType,
  CMSContentResponse,
  UpdateCMSContentRequest,
  CMSApiResponse,
} from '@/features/cms/types/cmsApiTypes';

export const cmsApi = createApi({
  reducerPath: 'cmsApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['CMS'],
  endpoints: (builder) => ({
    /**
     * Fetch content for a specific CMS type ('about' | 'privacy' | 'terms' | 'faq').
     * GET /admin/content/:type
     */
    getCMSContent: builder.query<CMSContentResponse, CMSContentType>({
      query: (type) => ({
        url: `/admin/content/${type}`,
        method: 'GET',
      }),
      transformResponse: (response: CMSApiResponse<CMSContentResponse>) => {
        return response.response;
      },
      providesTags: (_result, _error, type) => [{ type: 'CMS', id: type }],
    }),

    /**
     * Update content for a specific CMS type.
     * PUT /admin/content/:type
     */
    updateCMSContent: builder.mutation<CMSContentResponse, UpdateCMSContentRequest>({
      query: ({ type, content }) => ({
        url: `/admin/content/${type}`,
        method: 'PUT',
        data: { content },
      }),
      transformResponse: (response: CMSApiResponse<CMSContentResponse>) => {
        return response.response;
      },
      invalidatesTags: (_result, _error, { type }) => [{ type: 'CMS', id: type }],
    }),
  }),
});

export const {
  useGetCMSContentQuery,
  useUpdateCMSContentMutation,
} = cmsApi;
