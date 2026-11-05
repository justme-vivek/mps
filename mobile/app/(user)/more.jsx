import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight, Download, Heart, LayoutDashboard, User } from 'lucide-react-native';
import Text from '../../src/components/ui/Text';
import Screen from '../../src/components/ui/Screen';
import PageTitle from '../../src/components/ui/PageTitle';
import Card from '../../src/components/ui/Card';
import Button from '../../src/components/ui/Button';
import ListRow from '../../src/components/ui/ListRow';
import Badge from '../../src/components/ui/Badge';
import { useAuth } from '../../src/features/auth/AuthContext';
import { colors } from '../../src/theme/tokens';

export default function MoreScreen() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();

  return (
    <Screen bottomTabBar maxWidth={880}>
      <PageTitle title="More" />

      {!user ? (
        <Card className="mb-4 border-primary-100 bg-primary-50">
          <View className="flex-row flex-wrap items-center justify-between" style={{ gap: 12 }}>
            <View className="min-w-[200px] flex-1">
              <Text className="text-[16px] font-bold text-primary-700">You're browsing as a guest</Text>
              <Text className="mt-0.5 text-[14px] text-ink-soft">
                Sign in to unlock favourites, downloads and sharing.
              </Text>
            </View>
            <Button title="Sign in" size="sm" onPress={() => router.push('/login')} />
          </View>
        </Card>
      ) : (
        <Card className="mb-4" onPress={() => router.push('/profile')} accessibilityLabel="Open profile">
          <View className="flex-row items-center">
            <View className="h-12 w-12 items-center justify-center rounded-full border-2 border-ink bg-surface">
              <Text className="text-[18px] font-bold text-ink">{user.name.charAt(0).toUpperCase()}</Text>
            </View>
            <View className="ml-3 flex-1">
              <View className="flex-row flex-wrap items-center" style={{ gap: 6 }}>
                <Text className="text-[16px] font-bold text-ink">{user.name}</Text>
                {isAdmin ? <Badge label="Admin" tone="accent" /> : null}
              </View>
              <Text className="text-[14px] text-ink-muted">{user.email}</Text>
            </View>
            <ChevronRight size={18} color={colors.inkFaint} />
          </View>
        </Card>
      )}

      <ListRow
        icon={<Heart size={18} color={colors.pen} style={{ marginRight: 12 }} />}
        title="My favourites"
        subtitle="Saved notices, events and photos"
        onPress={() => router.push('/favorites')}
        className="mb-3"
      />
      <ListRow
        icon={<Download size={18} color={colors.pen} style={{ marginRight: 12 }} />}
        title="Downloads"
        subtitle="School documents (PDF)"
        onPress={() => router.push('/downloads')}
        className="mb-3"
      />
      <ListRow
        icon={<User size={18} color={colors.pen} style={{ marginRight: 12 }} />}
        title="Profile"
        subtitle={user ? 'Account details and sign out' : 'Sign in or create an account'}
        onPress={() => router.push('/profile')}
        className="mb-3"
      />
      {isAdmin ? (
        <ListRow
          icon={<LayoutDashboard size={18} color={colors.pen} style={{ marginRight: 12 }} />}
          title="Admin dashboard"
          subtitle="Manage school content"
          onPress={() => router.push('/admin')}
          className="mb-3"
        />
      ) : null}
    </Screen>
  );
}
