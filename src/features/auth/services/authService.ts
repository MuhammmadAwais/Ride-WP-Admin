/**
 * @fileoverview Mock authentication service.
 * Validates credentials against the hardcoded admin account.
 * Replace this with a real API call when backend is integrated.
 */
import { MOCK_ADMIN_EMAIL, MOCK_ADMIN_PASSWORD, MOCK_ADMIN_NAME } from '@/Constants';
import type { LoginSuccessPayload } from '@/features/auth/types/authTypes';

/** Simulated network latency in milliseconds. */
const MOCK_DELAY_MS = 900;

/**
 * Simulates an async login request.
 * Resolves with user data on valid credentials; rejects with an error on failure.
 *
 * @param email    - The email address entered by the user.
 * @param password - The plaintext password entered by the user.
 * @returns A promise that resolves to `LoginSuccessPayload`.
 * @throws {Error} When credentials do not match the mock admin account.
 */
export async function mockLogin(
  email: string,
  password: string
): Promise<LoginSuccessPayload> {
  // Simulate network round-trip
  await new Promise<void>((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

  const normalizedEmail = email.trim().toLowerCase();

  if (
    normalizedEmail !== MOCK_ADMIN_EMAIL.toLowerCase() ||
    password !== MOCK_ADMIN_PASSWORD
  ) {
    throw new Error('Invalid email or password. Please try again.');
  }

  return {
    user: {
      email: MOCK_ADMIN_EMAIL,
      name: MOCK_ADMIN_NAME,
      role: 'admin',
      avatarUrl: undefined,
    },
  };
}
