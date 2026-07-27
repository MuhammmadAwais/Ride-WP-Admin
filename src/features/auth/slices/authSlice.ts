/**
 * @fileoverview Auth Redux slice with RTK Query setCredentials support and LocalStorage persistence.
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { mockLogin } from '@/features/auth/services/authService';
import { STORAGE_KEYS } from '@/Constants';
import type {
  AuthState,
  AdminUser,
  LoginFormValues,
  LoginSuccessPayload,
} from '@/features/auth/types/authTypes';

// ─── Initial State ────────────────────────────────────────────────────────────

const storedToken =
  typeof window !== 'undefined'
    ? localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
    : null;

const initialState: AuthState = {
  user: null,
  token: storedToken,
  isAuthenticated: Boolean(storedToken),
  isLoading: false,
  error: null,
};

// ─── Legacy Async Thunk (Mock Fallback) ───────────────────────────────────────

/**
 * Legacy mock login thunk for offline testing or fallback.
 */
export const loginUser = createAsyncThunk<
  LoginSuccessPayload,
  LoginFormValues,
  { rejectValue: string }
>(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const result = await mockLogin(credentials.email, credentials.password);
      const fakeToken = 'mock_jwt_token_development';
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, fakeToken);
      return {
        user: result.user,
        token: fakeToken,
      };
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
     * Store live API credentials in state and persist JWT in localStorage.
     */
    setCredentials(
      state,
      action: PayloadAction<{ user: AdminUser; token: string }>
    ) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, action.payload.token);
    },
    /**
     * Clears authenticated user, token, and resets the auth state.
     * Purges JWT from localStorage.
     */
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
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
        state.token = action.payload.token;
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

export const { setCredentials, logout, clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
