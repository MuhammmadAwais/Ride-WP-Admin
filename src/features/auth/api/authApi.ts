/**
 * @fileoverview RTK Query API slice for Admin Authentication.
 * Communicates with /admin/login endpoint and unwraps standardized API response wrappers.
 */
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/api/baseQuery';
import type {
  LoginAdminRequest,
  LoginAdminResponse,
  AuthApiResponse,
} from '@/features/auth/types/authTypes';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    /**
     * Admin Login mutation targeting POST /admin/login.
     * Extracts `data.response` containing `{ id, email, name, role, token }`.
     */
    loginAdmin: builder.mutation<LoginAdminResponse, LoginAdminRequest>({
      query: (credentials) => ({
        url: '/admin/login',
        method: 'POST',
        data: credentials,
      }),
      transformResponse: (response: AuthApiResponse<LoginAdminResponse>) => {
        return response.response;
      },
    }),
  }),
});

export const { useLoginAdminMutation } = authApi;
