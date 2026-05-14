/**
 * @fileoverview Auth Redux slice with mock login thunk and LocalStorage-backed persistence.
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { mockLogin } from '@/features/auth/services/authService';
import type {
  AuthState,
  AdminUser,
  LoginFormValues,
  LoginSuccessPayload,
} from '@/features/auth/types/authTypes';

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// ─── Async Thunk ──────────────────────────────────────────────────────────────

/**
 * Authenticates the admin using mock credentials.
 * On success, the user object is stored in Redux (persisted via redux-persist).
 *
 * @param credentials - Email and password from the login form.
 * @returns The authenticated AdminUser on success, rejects with error message on failure.
 */
export const loginUser = createAsyncThunk<
  LoginSuccessPayload,
  LoginFormValues,
  { rejectValue: string }
>(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      return await mockLogin(credentials.email, credentials.password);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Authentication failed.';
      return rejectWithValue(message);
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Clears authenticated user and resets the auth state.
     */
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    /**
     * Clears the current auth error message.
     */
    clearError(state) {
      state.error = null;
    },
    /**
     * Directly sets the user (used by redux-persist rehydration checks).
     */
    setUser(state, action: PayloadAction<AdminUser>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload ?? 'An unexpected error occurred.';
      });
  },
});

export const { logout, clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
