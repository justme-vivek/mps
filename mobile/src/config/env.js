/**
 * Centralized environment configuration for the mobile app.
 * Values come from mobile/.env (EXPO_PUBLIC_* variables).
 */
export const env = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api',
};
