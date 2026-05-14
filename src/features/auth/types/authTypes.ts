/**
 * @fileoverview Strict TypeScript interfaces for the Auth feature.
 * No `any` types. All shapes are explicit and immutable where applicable.
 */

// ─── Domain Models ────────────────────────────────────────────────────────────

/**
 * Represents an authenticated administrator user.
 */
export interface AdminUser {
  readonly email: string;
  readonly name: string;
  readonly role: 'admin';
  readonly avatarUrl?: string;
}

// ─── Redux State ──────────────────────────────────────────────────────────────

/**
 * Shape of the auth slice in the Redux store.
 */
export interface AuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ─── Form Schemas ─────────────────────────────────────────────────────────────

/**
 * Values submitted by the login form (validated with Zod).
 */
export interface LoginFormValues {
  email: string;
  password: string;
}

// ─── Service Contracts ────────────────────────────────────────────────────────

/**
 * Resolved value from a successful mock login attempt.
 */
export interface LoginSuccessPayload {
  user: AdminUser;
}

/**
 * Rejected value from a failed mock login attempt.
 */
export interface LoginFailurePayload {
  message: string;
}
