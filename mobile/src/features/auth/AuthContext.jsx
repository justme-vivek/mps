import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { bindAuthToken, onUnauthorized } from '../../services/api';
import {
  clearSession,
  loadSession,
  loginRequest,
  meRequest,
  saveSession,
} from './authService';

const AuthContext = createContext(null);

/**
 * Session states: 'loading' → 'guest' | 'authenticated'.
 * The role comes from the server — the app routes admins to the dashboard
 * and normal users (or guests) to the browsing experience.
 */
export function AuthProvider({ children }) {
  const [status, setStatus] = useState('loading');
  const [user, setUser] = useState(null);
  const tokenRef = useRef(null);

  useEffect(() => {
    bindAuthToken(() => tokenRef.current);
    onUnauthorized(async () => {
      // token expired/invalid mid-session → drop back to guest
      tokenRef.current = null;
      setUser(null);
      setStatus('guest');
      await clearSession();
    });

    (async () => {
      const session = await loadSession();
      if (session?.token) {
        try {
          const me = await meRequest(session.token);
          tokenRef.current = session.token;
          setUser(me);
          setStatus('authenticated');
        } catch (error) {
          if (error?.response?.status !== 401) {
            // network issue — keep cached session optimistically
            tokenRef.current = session.token;
            setUser(session);
            setStatus('authenticated');
            return;
          }
          await clearSession();
        }
      }
      setStatus('guest');
    })();
  }, []);

  /** Adopt a session returned by any auth flow (login, OTP registration…). */
  const adoptSession = useCallback(async (session) => {
    await saveSession(session);
    tokenRef.current = session.token;
    setUser(session);
    setStatus('authenticated');
  }, []);

  const login = useCallback(
    async (email, password) => {
      const data = await loginRequest(email, password);
      await adoptSession(data);
      return data;
    },
    [adoptSession]
  );

  const logout = useCallback(async () => {
    await clearSession();
    tokenRef.current = null;
    setUser(null);
    setStatus('guest');
  }, []);

  const value = {
    status,
    user,
    isAdmin: user?.role === 'admin',
    login,
    adoptSession,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
