/**
 * @fileoverview Strict TypeScript interfaces for the Auth feature.
 * No `any` types. All shapes are explicit and immutable where applicable.
 */

// ─── Domain Models ────────────────────────────────────────────────────────────

/**
 * Represents an authenticated administrator user.
 */
export interface AdminUser {
  readonly id: number;
  readonly email: string;
  readonly name: string;
  readonly role: string;
  readonly token?: string;
  readonly avatarUrl?: string;
}

// ─── Redux State ──────────────────────────────────────────────────────────────

/**
 * Shape of the auth slice in the Redux store.
 */
export interface AuthState {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ─── Form Schemas & API Contracts ─────────────────────────────────────────────

/**
 * Values submitted by the login form (validated with Zod).
 */
export interface LoginFormValues {
  email: string;
  password: string;
}

/**
 * Payload sent to POST /admin/login endpoint.
 */
export interface LoginAdminRequest {
  email: string;
  password: string;
}

/**
 * Backend data.response payload returned from POST /admin/login.
 */
export interface LoginAdminResponse {
  id: number;
  email: string;
  name: string;
  role: string;
  token: string;
}

/**
 * Standardized generic API response wrapper from backend.
 */
export interface AuthApiResponse<T> {
  statusCode: number;
  message: string;
  response: T;
}

/**
 * Resolved value from login attempt.
 */
export interface LoginSuccessPayload {
  user: AdminUser;
  token: string;
}

/**
 * Rejected value from failed login attempt.
 */
export interface LoginFailurePayload {
  message: string;
}
