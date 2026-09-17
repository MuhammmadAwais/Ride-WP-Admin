/**
 * @fileoverview RTK Query API slice for Subscription and Plan Management.
 * Implements tag-based automated cache invalidation for CRUD operations on plans.
 */
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/api/baseQuery';
import type {
  SubscriptionPlan,
  CreatePlanRequest,
  UpdatePlanRequest,
  DeletePlanRequest,
  GetPlanByIdRequest,
  SubscriptionApiResponse,
} from '@/features/subscriptions/types/subscriptionTypes';

export const subscriptionApi = createApi({
  reducerPath: 'subscriptionApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Plans'],
  endpoints: (builder) => ({
    /**
     * Fetch all subscription plans.
     * GET /admin/subscription/plans
     */
    getPlans: builder.query<SubscriptionPlan[], void>({
      query: () => ({
        url: '/admin/subscription/plans',
        method: 'GET',
      }),
      transformResponse: (response: SubscriptionApiResponse<SubscriptionPlan[]>) => {
        return response.response;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Plans' as const, id })),
              { type: 'Plans', id: 'LIST' },
            ]
          : [{ type: 'Plans', id: 'LIST' }],
    }),

    /**
     * Fetch a specific subscription plan by ID.
     * GET /admin/subscription/plan?planId=X
     */
    getPlanById: builder.query<SubscriptionPlan, GetPlanByIdRequest>({
      query: ({ planId }) => ({
        url: `/admin/subscription/plan`,
        method: 'GET',
        params: { planId },
      }),
      transformResponse: (response: SubscriptionApiResponse<SubscriptionPlan>) => {
        return response.response;
      },
      providesTags: (_result, _error, arg) => [{ type: 'Plans', id: arg.planId }],
    }),

    /**
     * Create a new subscription plan.
     * POST /admin/subscription/plan
     */
    createPlan: builder.mutation<SubscriptionPlan, CreatePlanRequest>({
      query: (body) => ({
        url: '/admin/subscription/plan',
        method: 'POST',
        data: body,
      }),
      transformResponse: (response: SubscriptionApiResponse<SubscriptionPlan>) => {
        return response.response;
      },
      invalidatesTags: [{ type: 'Plans', id: 'LIST' }],
    }),

    /**
     * Update an existing subscription plan.
     * PUT /admin/subscription/plan
     */
    updatePlan: builder.mutation<SubscriptionPlan, UpdatePlanRequest>({
      query: (body) => ({
        url: '/admin/subscription/plan',
        method: 'PUT',
        data: body,
      }),
      transformResponse: (response: SubscriptionApiResponse<SubscriptionPlan>) => {
        return response.response;
      },
      invalidatesTags: (_result, _error, arg) => [
        { type: 'Plans', id: arg.planId },
        { type: 'Plans', id: 'LIST' },
      ],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          subscriptionApi.util.updateQueryData('getPlans', undefined, (draft) => {
            const plan = draft.find((p) => p.id === arg.planId);
            if (plan) {
              plan.name = arg.name;
              plan.description = arg.description;
              plan.price = arg.price;
              plan.currency = arg.currency;
              plan.billingInterval = arg.billingInterval;
              if (arg.planScope) plan.planScope = arg.planScope;
              if (arg.trialPeriodDays !== undefined) plan.trialPeriodDays = arg.trialPeriodDays;
              plan.isActive = arg.isActive;
              plan.config = { ...plan.config, ...arg.config };
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    /**
     * Delete a subscription plan.
     * DELETE /admin/subscription/plan
     */
    deletePlan: builder.mutation<SubscriptionPlan, DeletePlanRequest>({
      query: (body) => ({
        url: '/admin/subscription/plan',
        method: 'DELETE',
        data: body,
      }),
      transformResponse: (response: SubscriptionApiResponse<SubscriptionPlan>) => {
        return response.response;
      },
      invalidatesTags: [{ type: 'Plans', id: 'LIST' }],
      async onQueryStarted({ planId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          subscriptionApi.util.updateQueryData('getPlans', undefined, (draft) => {
            const index = draft.findIndex((p) => p.id === planId);
            if (index !== -1) {
              draft.splice(index, 1);
            }
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
  useGetPlansQuery,
  useGetPlanByIdQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
} = subscriptionApi;
