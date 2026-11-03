import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LogOut, ShieldCheck } from 'lucide-react-native';
import Screen from '../../src/components/ui/Screen';
import Card from '../../src/components/ui/Card';
import Button from '../../src/components/ui/Button';
import Badge from '../../src/components/ui/Badge';
import ConfirmDialog from '../../src/components/ui/ConfirmDialog';
import ListRow from '../../src/components/ui/ListRow';
import { useAuth } from '../../src/features/auth/AuthContext';
import { formatDate } from '../../src/utils/format';

export default function AdminProfile() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <Screen>
      <Text className="mb-1 text-2xl font-black text-ink">Profile</Text>
      <Text className="mb-4 text-[13px] text-ink-muted">Your admin account</Text>

      <Card className="mb-4 items-center py-8">
        <View className="h-20 w-20 items-center justify-center rounded-full bg-primary-600">
          <Text className="text-3xl font-black text-white">{user?.name?.charAt(0)?.toUpperCase() || 'A'}</Text>
        </View>
        <Text className="mt-3 text-lg font-extrabold text-ink">{user?.name}</Text>
        <Text className="text-[13px] text-ink-muted">{user?.email}</Text>
        <View className="mt-2 flex-row items-center" style={{ gap: 6 }}>
          <ShieldCheck size={14} color="#B45309" />
          <Badge label="ADMIN" tone="accent" />
        </View>
      </Card>

      <Card className="mb-4">
        <View className="flex-row justify-between py-1.5">
          <Text className="text-[14px] text-ink-muted">Account ID</Text>
          <Text className="text-[13px] font-semibold text-ink" numberOfLines={1}>
            {user?._id}
          </Text>
        </View>
        <View className="flex-row justify-between py-1.5">
          <Text className="text-[14px] text-ink-muted">Member since</Text>
          <Text className="text-[13px] font-semibold text-ink">{formatDate(new Date())}</Text>
        </View>
        <View className="flex-row justify-between py-1.5">
          <Text className="text-[14px] text-ink-muted">Access level</Text>
          <Text className="text-[13px] font-semibold text-ink">Full content management</Text>
        </View>
      </Card>

      <Button
        title="Browse app as user"
        variant="outline"
        className="mb-3"
        onPress={() => router.replace('/')}
      />
      <ListRow
        title="Change Password"
        subtitle="Confirm with an email code"
        onPress={() => router.push('/change-password')}
        className="mb-3"
      />
      <Button
        title="Sign Out"
        variant="danger"
        icon={<LogOut size={16} color="#FFFFFF" />}
        onPress={() => setConfirmOpen(true)}
      />

      <ConfirmDialog
        visible={confirmOpen}
        title="Sign out?"
        message="You will need your admin credentials to sign back in."
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
