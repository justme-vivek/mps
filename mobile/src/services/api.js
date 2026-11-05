import axios from 'axios';
import { env } from '../config/env';
import { getNetwork, trackRequestEnd, trackRequestStart } from './network';

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
  // Fail writes fast when we know there is no connection, instead of a 20s hang.
  if (!getNetwork().online && (config.method || 'get').toLowerCase() !== 'get') {
    return Promise.reject(Object.assign(new Error('You are offline. Reconnect and try again.'), { isOffline: true }));
  }
  config.metadata = { trackId: trackRequestStart() };
  return config;
});

api.interceptors.response.use(
  (response) => {
    trackRequestEnd(response.config?.metadata?.trackId, false, true);
    return response;
  },
  (error) => {
    // No response at all = network failure / timeout (not an HTTP error).
    trackRequestEnd(error.config?.metadata?.trackId, !error.response && error.code !== 'ERR_CANCELED');
    const status = error.response?.status;
    const url = error.config?.url || '';
    const isAuthAttempt = url.includes('/auth/login') || url.includes('/auth/register');
    if (status === 401 && !isAuthAttempt && unauthorizedHandler) {
      unauthorizedHandler();
    }
    return Promise.reject(error);
  }
);

/** True when the failure was the network, not the server. */
export function isNetworkError(error) {
  return !!error && (error.isOffline || (!error.response && (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED' || /network|timeout/i.test(error.message || ''))));
}

export function apiErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (error?.isOffline) return error.message;
  if (isNetworkError(error)) return "Can't reach the server. Check your internet connection and try again.";
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
