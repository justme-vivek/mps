import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { LogIn, LogOut, UserPlus, KeyRound } from 'lucide-react-native';
import Text from '../../src/components/ui/Text';
import Screen from '../../src/components/ui/Screen';
import PageTitle from '../../src/components/ui/PageTitle';
import Card from '../../src/components/ui/Card';
import Button from '../../src/components/ui/Button';
import ConfirmDialog from '../../src/components/ui/ConfirmDialog';
import Badge from '../../src/components/ui/Badge';
import ListRow from '../../src/components/ui/ListRow';
import { useAuth } from '../../src/features/auth/AuthContext';
import { colors } from '../../src/theme/tokens';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isAdmin, logout } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!user) {
    return (
      <Screen bottomTabBar maxWidth={560}>
        <PageTitle title="Profile" />
        <Card className="items-center py-10">
          <View className="h-16 w-16 items-center justify-center rounded-full border-2 border-ink bg-surface">
            <Text className="font-serif text-[28px] text-ink">?</Text>
          </View>
          <Text className="mt-3 font-serif text-[22px] text-ink">You're not signed in</Text>
          <Text className="mt-1 text-center text-[15px] text-ink-muted">
            Sign in to use favourites, downloads and sharing.
          </Text>
          <View className="mt-5 w-full" style={{ gap: 10 }}>
            <Button title="Sign in" icon={<LogIn size={16} color="#FFFFFF" />} onPress={() => router.push('/login')} />
            <Button
              title="Create account"
              variant="outline"
              icon={<UserPlus size={16} color={colors.pen} />}
              onPress={() => router.push('/login')}
            />
          </View>
        </Card>
      </Screen>
    );
  }

  return (
    <Screen bottomTabBar maxWidth={560}>
      <PageTitle title="Profile" />

      <Card className="mb-4 items-center py-8">
        <View className="h-20 w-20 items-center justify-center rounded-full border-2 border-ink bg-surface">
          <Text className="font-serif text-[34px] text-ink">{user.name.charAt(0).toUpperCase()}</Text>
        </View>
        <Text className="mt-3 text-[18px] font-bold text-ink">{user.name}</Text>
        <Text className="text-[14px] text-ink-muted">{user.email}</Text>
        <View className="mt-2">
          <Badge label={isAdmin ? 'Admin' : 'Student or parent'} tone={isAdmin ? 'accent' : 'primary'} />
        </View>
      </Card>

      <ListRow
        title="My favourites"
        subtitle="Everything you've saved"
        onPress={() => router.push('/favorites')}
        className="mb-3"
      />
      <ListRow
        title="Downloads"
        subtitle="School documents (PDF)"
        onPress={() => router.push('/downloads')}
        className="mb-3"
      />
      <ListRow
        icon={<KeyRound size={18} color={colors.pen} style={{ marginRight: 12 }} />}
        title="Change password"
        subtitle="Confirm with an email code"
        onPress={() => router.push('/change-password')}
        className="mb-3"
      />

      <Button
        title="Sign out"
        variant="danger"
        icon={<LogOut size={16} color="#FFFFFF" />}
        className="mt-2"
        onPress={() => setConfirmOpen(true)}
      />

      <ConfirmDialog
        visible={confirmOpen}
        title="Sign out?"
        message="You can sign back in any time. Your favourites stay saved to your account."
        confirmLabel="Sign out"
        danger
        onConfirm={async () => {
          setConfirmOpen(false);
          await logout();
          router.replace('/');
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </Screen>
  );
}
