import React from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight, Download, Heart, LayoutDashboard, LogIn, User } from 'lucide-react-native';
import Screen from '../../src/components/ui/Screen';
import Card from '../../src/components/ui/Card';
import ListRow from '../../src/components/ui/ListRow';
import Badge from '../../src/components/ui/Badge';
import { useAuth } from '../../src/features/auth/AuthContext';

export default function MoreScreen() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();

  return (
    <Screen>
      <Text className="mb-3 text-2xl font-black text-ink">More</Text>

      {!user ? (
        <Card className="mb-4 border-primary-100 bg-primary-50">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-[15px] font-bold text-primary-700">You're browsing as a guest</Text>
              <Text className="mt-0.5 text-[13px] text-primary-600">
                Sign in to unlock favourites, downloads and sharing.
              </Text>
            </View>
            <Text
              onPress={() => router.push('/login')}
              className="rounded-full bg-primary-600 px-4 py-2 text-[13px] font-bold text-white"
            >
              Sign in
            </Text>
          </View>
        </Card>
      ) : (
        <Card
          className="mb-4"
          onPress={() => router.push('/profile')}
        >
          <View className="flex-row items-center">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-primary-600">
              <Text className="text-lg font-black text-white">{user.name.charAt(0).toUpperCase()}</Text>
            </View>
            <View className="ml-3 flex-1">
              <View className="flex-row items-center" style={{ gap: 6 }}>
                <Text className="text-[15px] font-bold text-ink">{user.name}</Text>
                {isAdmin ? <Badge label="ADMIN" tone="accent" /> : null}
              </View>
              <Text className="text-[13px] text-ink-muted">{user.email}</Text>
            </View>
            <ChevronRight size={18} color="#9CA3AF" />
          </View>
        </Card>
      )}

      <ListRow
        icon={<Heart size={18} color="#4F46E5" />}
        title="My Favourites"
        subtitle="Saved notices, events and photos"
        onPress={() => router.push('/favorites')}
        className="mb-3"
      />
      <ListRow
        icon={<Download size={18} color="#4F46E5" />}
        title="Downloads"
        subtitle="School documents (PDF)"
        onPress={() => router.push('/downloads')}
        className="mb-3"
      />
      <ListRow
        icon={<User size={18} color="#4F46E5" />}
        title="Profile"
        subtitle={user ? 'Account details and sign out' : 'Sign in or create an account'}
        onPress={() => router.push('/profile')}
        className="mb-3"
      />
      {isAdmin ? (
        <ListRow
          icon={<LayoutDashboard size={18} color="#4F46E5" />}
          title="Admin Dashboard"
          subtitle="Manage school content"
          onPress={() => router.push('/admin')}
          className="mb-3"
        />
      ) : null}
    </Screen>
  );
}
