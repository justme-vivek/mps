import { Platform } from 'react-native';
import { useSyncExternalStore } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';

/**
 * Tiny network store (no extra state library).
 *  - online: device has a usable connection (NetInfo)
 *  - slow:   a request has been in flight for longer than SLOW_AFTER_MS
 * The api client reports request start/end here; react-query's onlineManager
 * is wired to NetInfo so queries pause offline and resume automatically.
 */
const SLOW_AFTER_MS = 2500;

let state = { online: true, slow: false };
const listeners = new Set();
const pending = new Map(); // id -> timer
let seq = 0;
let started = false;

function set(patch) {
  const next = { ...state, ...patch };
  if (next.online === state.online && next.slow === state.slow) return;
  state = next;
  listeners.forEach((l) => l());
}

export function startNetworkMonitor() {
  if (started) return;
  started = true;
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    // Browsers expose reliable online/offline events; no reachability probe needed.
    const apply = () => {
      const online = navigator.onLine !== false;
      onlineManager.setOnline(online);
      set({ online });
    };
    window.addEventListener('online', apply);
    window.addEventListener('offline', apply);
    apply();
    return;
  }
  NetInfo.addEventListener((s) => {
    // isInternetReachable is null until probed; only treat an explicit false as offline.
    const online = s.isConnected !== false && s.isInternetReachable !== false;
    onlineManager.setOnline(online);
    set({ online });
  });
}

/** Called by the axios interceptors. */
export function trackRequestStart() {
  const id = ++seq;
  pending.set(id, setTimeout(() => set({ slow: true }), SLOW_AFTER_MS));
  return id;
}

export function trackRequestEnd(id, failedToConnect = false, succeeded = false) {
  const timer = pending.get(id);
  if (timer) clearTimeout(timer);
  pending.delete(id);
  if (pending.size === 0) set({ slow: false });
  if (failedToConnect) set({ online: false });
  if (succeeded) set({ online: true }); // a real response proves we are connected
}

export function getNetwork() {
  return state;
}

const subscribe = (l) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function useNetwork() {
  return useSyncExternalStore(subscribe, getNetwork, getNetwork);
}
