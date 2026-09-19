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
      async queryFn(key, _queryApi, _extraOptions, fetchWithBQ) {
        const result = await fetchWithBQ({
          url: `/admin/content/${key}`,
          method: 'GET',
        });

        if (result.error) {
          const errorData = result.error.data as { message?: string; error?: string } | undefined;
          const msg = errorData?.message || errorData?.error || result.error.message || '';
          // If backend returns "Content not found." (e.g. 500/404 when key has not been seeded yet)
          if (
            result.error.status === 404 ||
            (typeof msg === 'string' && msg.toLowerCase().includes('not found'))
          ) {
            return {
              data: {
                key,
                title:
                  key === 'about'
                    ? 'About Ride With Pals'
                    : key === 'privacy_policy'
                    ? 'Privacy Policy'
                    : 'Terms & Conditions',
                content: '',
                titleEs: key === 'about' ? 'Sobre Ride With Pals' : '',
                contentEs: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            };
          }
          return { error: result.error };
        }

        const res = result.data as CMSApiResponse<CMSContentResponse>;
        return { data: res.response };
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
