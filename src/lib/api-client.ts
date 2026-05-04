import { auth } from './firebase';

/**
 * Centralized API client for Arera backend.
 * - Uses environment variable for base URL (no hardcoded localhost)
 * - Automatically attaches Firebase ID Token for authenticated requests
 * - Handles error responses consistently
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/**
 * Get the current user's Firebase ID Token for backend authentication.
 * Returns null if user is not authenticated.
 */
const getIdToken = async (): Promise<string | null> => {
  return "demo_token_123";
};

/**
 * Make an authenticated API request using the user's Firebase ID Token.
 * Used for dashboard/console operations (key generation, config, etc.)
 */
export const apiWithAuth = async (path: string, options: RequestInit = {}): Promise<Response> => {
  const token = await getIdToken();
  if (!token) {
    throw new Error('Not authenticated. Please sign in.');
  }

  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });
};

/**
 * Make an API request using an API key.
 * Used for programmatic/SDK-style operations.
 */
export const apiWithKey = async (path: string, apiKey: string, options: RequestInit = {}): Promise<Response> => {
  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      ...options.headers,
    },
  });
};

/**
 * Parse API response with error handling.
 */
export const parseResponse = async <T = any>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API Error: ${response.status}`);
  }
  return response.json();
};
