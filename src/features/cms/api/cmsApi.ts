/**
 * @fileoverview RTK Query API slice for System Content (CMS).
 * Handles fetching, public endpoint proxying, and updating dynamic platform pages
 * (Privacy Policy, Terms & Conditions, About) with bilingual support and cache invalidation.
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
     * Fetch content for a specific CMS key ('privacy_policy' | 'terms_conditions' | 'about').
     * GET /admin/content/:key
     */
    getCMSContent: builder.query<CMSContentResponse, CMSContentType>({
      query: (key) => ({
        url: `/admin/content/${key}`,
        method: 'GET',
      }),
      transformResponse: (response: CMSApiResponse<CMSContentResponse>) => {
        return response.response;
      },
      providesTags: (_result, _error, key) => [{ type: 'CMS', id: key }],
    }),

    /**
     * Fetch public content for a specific CMS key (consumed by Mobile Apps without auth).
     * GET /public/content/:key
     */
    getPublicCMSContent: builder.query<CMSContentResponse, CMSContentType>({
      query: (key) => ({
        url: `/public/content/${key}`,
        method: 'GET',
      }),
      transformResponse: (response: CMSApiResponse<CMSContentResponse>) => {
        return response.response;
      },
    }),

    /**
     * Update content for a specific CMS key with optional bilingual copy.
     * PUT /admin/content/:key — body: { title, content, titleEs, contentEs }
     */
    updateCMSContent: builder.mutation<CMSContentResponse, UpdateCMSContentRequest>({
      query: ({ type, title, content, titleEs, contentEs, language }) => ({
        url: `/admin/content/${type}`,
        method: 'PUT',
        headers: language ? { language } : undefined,
        data: {
          title,
          content,
          ...(titleEs ? { titleEs } : {}),
          ...(contentEs ? { contentEs } : {}),
        },
      }),
      transformResponse: (response: CMSApiResponse<CMSContentResponse>) => {
        return response.response;
      },
      invalidatesTags: (_result, _error, { type }) => [{ type: 'CMS', id: type }],
      async onQueryStarted({ type, title, content, titleEs, contentEs }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          cmsApi.util.updateQueryData('getCMSContent', type, (draft) => {
            draft.title = title;
            draft.content = content;
            if (titleEs !== undefined) draft.titleEs = titleEs;
            if (contentEs !== undefined) draft.contentEs = contentEs;
            draft.updatedAt = new Date().toISOString();
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetCMSContentQuery,
  useGetPublicCMSContentQuery,
  useUpdateCMSContentMutation,
} = cmsApi;
