import * as SecureStore from 'expo-secure-store';
import { api } from '../../services/api';

const SESSION_KEY = 'mps.session';

/** Session shape: { _id, name, email, role, token } */
export async function loadSession() {
  try {
    const raw = await SecureStore.getItemAsync(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function saveSession(session) {
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
}

export async function clearSession() {
  try {
    await SecureStore.deleteItemAsync(SESSION_KEY);
  } catch {
    // nothing to clear
  }
}

export async function loginRequest(email, password) {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
}

export async function meRequest(token) {
  const { data } = await api.get('/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

// --- Registration (OTP-verified; account is created after the code) ---
export async function registerInitiate(email) {
  const { data } = await api.post('/auth/register/initiate', { email });
  return data;
}

export async function registerVerify({ otpId, code, name, password }) {
  const { data } = await api.post('/auth/register/verify', { otpId, code, name, password });
  return data;
}

// --- Forgot password (OTP first, then new password) ---
export async function forgotPasswordInitiate(email) {
  const { data } = await api.post('/auth/forgot-password/initiate', { email });
  return data;
}

export async function forgotPasswordVerify({ otpId, code }) {
  const { data } = await api.post('/auth/forgot-password/verify', { otpId, code });
  return data;
}

export async function resetPassword({ resetToken, password }) {
  const { data } = await api.post('/auth/reset-password', { resetToken, password });
  return data;
}

// --- Change password (logged in; new password first, then OTP confirm) ---
export async function changePasswordInitiate() {
  const { data } = await api.post('/auth/change-password/initiate');
  return data;
}

export async function changePasswordConfirm({ otpId, code, password }) {
  const { data } = await api.post('/auth/change-password/confirm', { otpId, code, password });
  return data;
}

