import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LogIn, LogOut, UserPlus, KeyRound } from 'lucide-react-native';
import Screen from '../../src/components/ui/Screen';
import Card from '../../src/components/ui/Card';
import Button from '../../src/components/ui/Button';
import ConfirmDialog from '../../src/components/ui/ConfirmDialog';
import Badge from '../../src/components/ui/Badge';
import ListRow from '../../src/components/ui/ListRow';
import { useAuth } from '../../src/features/auth/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isAdmin, logout } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!user) {
    return (
      <Screen>
        <Text className="mb-3 text-2xl font-black text-ink">Profile</Text>
        <Card className="items-center py-10">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-primary-50">
            <Text className="text-2xl font-black text-primary-600">?</Text>
          </View>
          <Text className="mt-3 text-lg font-bold text-ink">You're not signed in</Text>
          <Text className="mt-1 text-center text-[13px] text-ink-muted">
            Sign in to use favourites, downloads and sharing.
          </Text>
          <View className="mt-5 w-full" style={{ gap: 10 }}>
            <Button title="Sign In" icon={<LogIn size={16} color="#FFFFFF" />} onPress={() => router.push('/login')} />
            <Button
              title="Create Account"
              variant="outline"
              icon={<UserPlus size={16} color="#4F46E5" />}
              onPress={() => router.push('/login')}
            />
          </View>
        </Card>
      </Screen>
    );
  }

  return (
    <Screen>
      <Text className="mb-3 text-2xl font-black text-ink">Profile</Text>

      <Card className="mb-4 items-center py-8">
        <View className="h-20 w-20 items-center justify-center rounded-full bg-primary-600">
          <Text className="text-3xl font-black text-white">{user.name.charAt(0).toUpperCase()}</Text>
        </View>
        <Text className="mt-3 text-lg font-extrabold text-ink">{user.name}</Text>
        <Text className="text-[13px] text-ink-muted">{user.email}</Text>
        <View className="mt-2">
          <Badge label={isAdmin ? 'ADMIN' : 'USER'} tone={isAdmin ? 'accent' : 'primary'} />
        </View>
      </Card>

      <ListRow
        title="My Favourites"
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
        icon={<KeyRound size={18} color="#4F46E5" />}
        title="Change Password"
        subtitle="Confirm with an email code"
        onPress={() => router.push('/change-password')}
        className="mb-3"
      />

      <Button
        title="Sign Out"
        variant="danger"
        icon={<LogOut size={16} color="#FFFFFF" />}
        className="mt-2"
        onPress={() => setConfirmOpen(true)}
      />

      <ConfirmDialog
        visible={confirmOpen}
        title="Sign out?"
        message="You can sign back in any time. Your favourites stay saved to your account."
        confirmLabel="Sign Out"
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
