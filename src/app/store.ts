/**
 * @fileoverview Redux store with redux-persist for LocalStorage persistence
 * and RTK Query API slice middleware registration.
 * Auth state is whitelisted; all other slices and API caches are session-only.
 */
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/es/storage';
import authReducer from '@/features/auth/slices/authSlice';
import { authApi } from '@/features/auth/api/authApi';
import { subscriptionApi } from '@/features/subscriptions/api/subscriptionApi';
import { STORAGE_KEYS } from '@/Constants';

// ─── Root Reducer ─────────────────────────────────────────────────────────────

const rootReducer = combineReducers({
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,
  [subscriptionApi.reducerPath]: subscriptionApi.reducer,
});

// ─── Persist Config ───────────────────────────────────────────────────────────

const persistConfig = {
  key: STORAGE_KEYS.PERSIST_ROOT,
  version: 1,
  storage,
  /** Only auth state is persisted; extend whitelist as new slices are added. */
  whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// ─── Store ────────────────────────────────────────────────────────────────────

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist internal action types
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(authApi.middleware, subscriptionApi.middleware),
  devTools: import.meta.env.DEV,
});

export const persistor = persistStore(store);

// ─── Typed Exports ────────────────────────────────────────────────────────────

/** Root state shape inferred from the un-persisted root reducer. */
export type RootState = ReturnType<typeof rootReducer>;

/** Typed dispatch including thunk middleware. */
export type AppDispatch = typeof store.dispatch;
