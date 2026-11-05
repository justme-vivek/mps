import React, { useState } from 'react';
import { View } from 'react-native';
import Text from '../src/components/ui/Text';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle2 } from 'lucide-react-native';
import Input from '../src/components/ui/Input';
import Button from '../src/components/ui/Button';
import Badge from '../src/components/ui/Badge';
import { resetPassword } from '../src/features/auth/authService';
import { peekPendingAuth, takePendingAuth } from '../src/utils/pendingAuth';
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

/** Forgot password final step — runs only after the OTP has been verified. */
export default function NewPassword() {
  const router = useRouter();
  const toast = useToast();
  const pending = peekPendingAuth(); // { resetToken } set by /otp-verify

  const { control, handleSubmit, formState: { isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { password: '', confirm: '' },
  });

  const onSubmit = async (values) => {
    if (!pending?.resetToken) {
      toast.show('Reset session lost. Please start again.', 'error');
      router.replace('/login');
      return;
    }
    try {
      await resetPassword({ resetToken: pending.resetToken, password: values.password });
      takePendingAuth();
      toast.show('Password updated — please sign in with your new password.', 'success');
      router.replace('/login');
    } catch (error) {
      toast.show(apiErrorMessage(error, 'Could not update the password'), 'error');
      router.replace('/login');
    }
  };

  if (!pending?.resetToken) {
    return (
      <SafeAreaView className="flex-1 bg-surface-alt">
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-center text-[15px] text-ink-muted">
            No reset in progress. Please start again from the login screen.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface-alt">
      <View className="w-full flex-1 justify-center self-center px-6" style={{ maxWidth: 480 }}>
        <View className="mb-6 items-center">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-success-50">
            <CheckCircle2 size={30} color="#0F6B38" />
          </View>
          <Text accessibilityRole="header" className="mt-3 font-serif text-[28px] leading-9 text-ink">Set new password</Text>
          <View className="mt-2">
            <Badge label="EMAIL VERIFIED" tone="success" />
          </View>
        </View>

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
        <Button title="Save Password" size="lg" className="mt-2" loading={isSubmitting} onPress={handleSubmit(onSubmit)} />
        <Text className="mt-4 text-center text-[12px] text-ink-faint">
          Saving signs you out everywhere and the old password stops working.
        </Text>
      </View>
    </SafeAreaView>
  );
}
