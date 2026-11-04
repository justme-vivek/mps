import React, { useState } from 'react';
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
import { forgotPasswordInitiate } from '../src/features/auth/authService';
import { apiErrorMessage } from '../src/services/api';
import { useToast } from '../src/components/ui/Toast';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
});

/** Forgot password step 1 — email only; the OTP goes out from here. */
export default function ForgotPassword() {
  const router = useRouter();
  const toast = useToast();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values) => {
    try {
      const email = values.email.trim();
      const data = await forgotPasswordInitiate(email);
      if (__DEV__ && data.devOtp) toast.show(`Dev OTP: ${data.devOtp}`, 'info', 8000);
      toast.show(data.message, 'info', 4000);
      if (data.otpId) {
        router.push({
          pathname: '/otp-verify',
          params: { purpose: 'reset', email, otpId: data.otpId },
        });
      }
    } catch (error) {
      toast.show(apiErrorMessage(error, 'Could not send the code'), 'error');
    }
  };

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

        <Text accessibilityRole="header" className="mt-6 font-serif text-[28px] leading-9 text-ink">Forgot password?</Text>
        <Text className="mt-1 text-[14px] leading-5 text-ink-muted">
          Enter your account email and we'll send a 6-digit code to verify it's you.
        </Text>

        <View className="mt-6">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Input
                label="Email"
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={value}
                onChangeText={onChange}
                error={error?.message}
              />
            )}
          />
          <Button title="Send Code" size="lg" loading={isSubmitting} onPress={handleSubmit(onSubmit)} />
        </View>
      </View>
    </SafeAreaView>
  );
}
