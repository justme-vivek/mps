import '../global.css';
import React, { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Stack, useRouter, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import { queryClient } from '../src/services/queryClient';
import { AuthProvider, useAuth } from '../src/features/auth/AuthContext';
import { ToastProvider } from '../src/components/ui/Toast';

SplashScreen.preventAutoHideAsync().catch(() => {});

/**
 * Role-based routing:
 *  - (user) group is always available (guests can browse; users get features)
 *  - /login is only reachable while signed out — ONE screen for every account type
 *  - /admin is guarded: only authenticated accounts with role 'admin'
 */
function RootNavigator() {
  const { status, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const redirectedRef = React.useRef(false);

  useEffect(() => {
    if (status !== 'loading') SplashScreen.hideAsync().catch(() => {});
  }, [status]);

  // Send restored admin sessions straight to the dashboard (once)
  useEffect(() => {
    if (
      status === 'authenticated' &&
      user?.role === 'admin' &&
      !redirectedRef.current &&
      !pathname?.startsWith('/admin')
    ) {
      redirectedRef.current = true;
      router.replace('/admin');
    }
    if (status !== 'authenticated') redirectedRef.current = false;
  }, [status, user, pathname, router]);

  if (status === 'loading') {
    return (
      <View className="flex-1 items-center justify-center bg-primary-700">
        <Text className="text-4xl font-black tracking-widest text-white">MPS</Text>
        <Text className="mt-1 text-sm font-medium text-primary-100">Modern Public School</Text>
        <ActivityIndicator color="#FFFFFF" className="mt-6" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="(user)" />
      <Stack.Protected guard={status !== 'authenticated'}>
        <Stack.Screen name="login" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      </Stack.Protected>
      <Stack.Protected guard={status === 'authenticated' && user?.role === 'admin'}>
        <Stack.Screen name="admin" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <AuthProvider>
              <RootNavigator />
            </AuthProvider>
          </ToastProvider>
          <StatusBar style="auto" />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
