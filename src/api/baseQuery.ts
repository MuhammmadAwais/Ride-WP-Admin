/**
 * @fileoverview RTK Query Axios baseQuery transport layer.
 * Configures global Axios client with token authorization interceptor and RTK Query compatibility.
 */
import type { BaseQueryFn } from '@reduxjs/toolkit/query/react';
import axios, { type AxiosRequestConfig, type AxiosError } from 'axios';
import { STORAGE_KEYS } from '@/Constants';

/**
 * Base URL for API requests, defaulting to production Ride With Pals API.
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://api.ridewithpals.com/api';

/**
 * Singleton Axios instance configured for API interactions.
 */
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor to attach JWT token and log outgoing API requests.
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(
      `🚀 [API Request] ${config.method?.toUpperCase()} ${config.baseURL || ''}${config.url}`,
      {
        params: config.params,
        data: config.data,
        headers: config.headers,
      }
    );

    return config;
  },
  (error) => {
    console.error('❌ [API Request Error]', error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor to log API responses and errors.
 */
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(
      `✅ [API Response] ${response.config.method?.toUpperCase()} ${response.config.url} (${response.status})`,
      response.data
    );
    return response;
  },
  (error: AxiosError) => {
    console.error(
      `❌ [API Response Error] ${error.config?.method?.toUpperCase()} ${error.config?.url} (${error.response?.status || 'Network Error'})`,
      error.response?.data || error.message
    );

    // Trigger session expiry purge for 401s on protected endpoints
    const isLoginEndpoint =
      error.config?.url?.includes('/admin/login') ||
      error.config?.url?.includes('/login');

    if (error.response?.status === 401 && !isLoginEndpoint) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      }
    }

    return Promise.reject(error);
  }
);

/**
 * RTK Query BaseQueryFn wrapper around Axios.
 * Handles request execution and transforms Axios errors into standardized RTK Query error objects.
 *
 * @param baseUrl - Optional base URL prefix to prepend to endpoint paths.
 */
export const axiosBaseQuery =
  (
    { baseUrl } = { baseUrl: '' }
  ): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig['method'];
      data?: AxiosRequestConfig['data'];
      params?: AxiosRequestConfig['params'];
      headers?: AxiosRequestConfig['headers'];
    },
    unknown,
    {
      status: number;
      data: unknown;
      message: string;
    }
  > =>
  async ({ url, method = 'GET', data, params, headers }) => {
    try {
      const result = await axiosInstance({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError<{
        message?: string;
        statusCode?: number;
        error?: string;
      }>;

      const status = err.response?.status || 500;
      const responseData = err.response?.data;
      const message =
        responseData?.message ||
        responseData?.error ||
        err.message ||
        'An unexpected network error occurred.';

      return {
        error: {
          status,
          data: responseData || err.message,
          message,
        },
      };
    }
  };
