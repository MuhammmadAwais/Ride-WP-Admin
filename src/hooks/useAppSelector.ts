/**
 * @fileoverview Typed wrapper around `useSelector` for this store.
 * Provides automatic RootState inference — no manual type annotation needed at call sites.
 */
import { useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState } from '@/app/store';

/**
 * Typed selector hook. Use this everywhere instead of `useSelector`.
 *
 * @example
 * const user = useAppSelector(state => state.auth.user);
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
