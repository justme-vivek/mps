import axios from 'axios';
import { env } from '../config/env';

export const api = axios.create({
  baseURL: env.apiUrl,
  timeout: 20000,
});

// --- Auth binding -------------------------------------------------------
// AuthProvider binds the current token getter + 401 handler at runtime so
// the API layer stays decoupled from React.
let tokenGetter = () => null;
let unauthorizedHandler = null;

export function bindAuthToken(getToken) {
  tokenGetter = getToken || (() => null);
}

export function onUnauthorized(handler) {
  unauthorizedHandler = handler;
}

api.interceptors.request.use((config) => {
  const token = tokenGetter();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';
    const isAuthAttempt = url.includes('/auth/login') || url.includes('/auth/register');
    if (status === 401 && !isAuthAttempt && unauthorizedHandler) {
      unauthorizedHandler();
    }
    return Promise.reject(error);
  }
);

export function apiErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  return error?.response?.data?.message || error?.message || fallback;
}

/**
 * Builds a multipart FormData payload for upload endpoints.
 * `file` is an RN file object: { uri, name, type }.
 */
export function buildUploadPayload(fields = {}, fileField, file) {
  const fd = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null) fd.append(key, String(value));
  });
  if (file) fd.append(fileField, file);
  return fd;
}
