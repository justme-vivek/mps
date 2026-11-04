import { QueryClient } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DAY = 24 * 60 * 60 * 1000;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: DAY, // must be >= persister maxAge or restored data is dropped
      // Serve cache first; pause (not fail) when offline and resume on reconnect.
      networkMode: 'offlineFirst',
      retry: (failureCount, error) => {
        const status = error?.response?.status;
        if (status && status >= 400 && status < 500) return false; // client errors won't heal
        return failureCount < 3;
      },
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: { networkMode: 'online', retry: false },
  },
});

/** Public, non-sensitive content that is safe to keep for offline reading. */
const PERSISTED_ROOTS = new Set(['notices', 'events', 'gallery', 'banners', 'downloads', 'faculty', 'content', 'settings']);

export const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'mps-query-cache',
  throttleTime: 2000,
});

export const persistOptions = {
  persister,
  maxAge: DAY,
  buster: 'v1', // bump to invalidate every device's cache after a data-shape change
  dehydrateOptions: {
    shouldDehydrateQuery: (q) => q.state.status === 'success' && PERSISTED_ROOTS.has(q.queryKey[0]),
  },
};

