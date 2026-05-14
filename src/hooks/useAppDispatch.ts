/**
 * @fileoverview Typed wrapper around `useDispatch` for this store.
 * Always use this instead of the raw `useDispatch` to get thunk types.
 */
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/app/store';

/**
 * Returns the typed Redux dispatch function.
 * Supports dispatching async thunks without manual casting.
 *
 * @returns The typed `AppDispatch` instance.
 */
export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
