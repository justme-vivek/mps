import '../global.css';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import Text from '../src/components/ui/Text';
import { Stack, useRouter, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import * as SplashScreen from 'expo-splash-screen';
import { persistOptions, queryClient } from '../src/services/queryClient';
import { startNetworkMonitor } from '../src/services/network';
import NetworkBanner from '../src/components/feedback/NetworkBanner';
import TopProgress from '../src/components/feedback/TopProgress';
import { AuthProvider, useAuth } from '../src/features/auth/AuthContext';
import { ToastProvider } from '../src/components/ui/Toast';
import { useFonts } from 'expo-font';
import { YoungSerif_400Regular } from '@expo-google-fonts/young-serif';
import {
  AtkinsonHyperlegible_400Regular,
  AtkinsonHyperlegible_700Bold,
} from '@expo-google-fonts/atkinson-hyperlegible';
import { colors } from '../src/theme/tokens';

SplashScreen.preventAutoHideAsync().catch(() => {});
startNetworkMonitor();

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
        <View className="h-16 w-16 items-center justify-center rounded-[20px] bg-accent">
          <Text className="font-serif text-4xl text-primary-700">M</Text>
        </View>
        <Text className="mt-4 font-serif text-2xl text-white">Modern Public School</Text>
        <ActivityIndicator color="#FFE066" className="mt-6" />
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
  const [fontsLoaded, fontError] = useFonts({
    YoungSerif_400Regular,
    AtkinsonHyperlegible_400Regular,
    AtkinsonHyperlegible_700Bold,
  });

  // Hold the splash screen until fonts are ready (falls back to system fonts on error).
  if (!fontsLoaded && !fontError) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.paper }}>
      <SafeAreaProvider>
        <PersistQueryClientProvider client={queryClient} persistOptions={persistOptions}>
          <ToastProvider>
            <AuthProvider>
              <RootNavigator />
              <TopProgress />
              <NetworkBanner />
            </AuthProvider>
          </ToastProvider>
          <StatusBar style="auto" />
        </PersistQueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
