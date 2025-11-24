import { randomBytes } from 'crypto';

/**
 * Generate a secure random token for email verification or password reset
 */
export function generateSecureToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Get token expiry date
 * @param hours - Number of hours until expiry
 */
export function getTokenExpiry(hours: number): Date {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}

/**
 * Check if a token has expired
 */
export function isTokenExpired(expiry: Date | null): boolean {
  if (!expiry) return true;
  return new Date() > expiry;
}
