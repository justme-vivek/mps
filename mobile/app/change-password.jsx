import React, { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import Text from '../src/components/ui/Text';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import Input from '../src/components/ui/Input';
import Button from '../src/components/ui/Button';
import { useAuth } from '../src/features/auth/AuthContext';
import { changePasswordInitiate } from '../src/features/auth/authService';
import { setPendingAuth } from '../src/utils/pendingAuth';
import { apiErrorMessage } from '../src/services/api';
import { useToast } from '../src/components/ui/Toast';

const schema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm: z.string().min(1, 'Please retype the new password'),
  })
  .refine((d) => d.password === d.confirm, {
    message: 'Passwords do not match',
    path: ['confirm'],
  });

/**
 * Flow 3 (logged in): type the new password first, then an OTP is emailed
 * to confirm — only after the code does the new password get saved.
 */
export default function ChangePassword() {
  const router = useRouter();
  const toast = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) router.replace('/');
  }, [user, router]);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { password: '', confirm: '' },
  });

  const onSubmit = async (values) => {
    try {
      const data = await changePasswordInitiate();
      setPendingAuth({ password: values.password });
      if (__DEV__ && data.devOtp) toast.show(`Dev OTP: ${data.devOtp}`, 'info', 8000);
      router.push({
        pathname: '/otp-verify',
        params: { purpose: 'change', email: user.email, otpId: data.otpId },
      });
    } catch (error) {
      toast.show(apiErrorMessage(error, 'Could not send the code'), 'error');
    }
  };

  if (!user) return null;

  return (
    <SafeAreaView className="flex-1 bg-surface-alt">
      <View className="w-full flex-1 self-center px-6" style={{ maxWidth: 480 }}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          className="mt-2 h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-line bg-surface"
        >
          <ChevronLeft size={22} color="#1B2A59" />
        </Pressable>

        <Text accessibilityRole="header" className="mt-6 font-serif text-[28px] leading-9 text-ink">Change password</Text>
        <Text className="mt-1 text-[14px] text-ink-muted">
          We'll email a 6-digit code to <Text className="font-bold text-ink">{user.email}</Text> to confirm.
        </Text>

        <View className="mt-6">
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Input
                label="New password"
                placeholder="At least 8 characters"
                secure
                value={value}
                onChangeText={onChange}
                error={error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="confirm"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Input
                label="Retype new password"
                placeholder="Repeat the new password"
                secure
                value={value}
                onChangeText={onChange}
                error={error?.message}
              
              returnKeyType="go"
              onSubmitEditing={handleSubmit(onSubmit)}
            />
            )}
          />
          <Button title="Continue" size="lg" className="mt-2" loading={isSubmitting} onPress={handleSubmit(onSubmit)} />
          <Text className="mt-4 text-center text-[12px] text-ink-faint">
            After confirming the code, the new password is saved and all signed-in
            devices are logged out.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
