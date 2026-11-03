import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Input from '../src/components/ui/Input';
import Button from '../src/components/ui/Button';
import { useAuth } from '../src/features/auth/AuthContext';
import { registerInitiate } from '../src/features/auth/authService';
import { setPendingAuth } from '../src/utils/pendingAuth';
import { apiErrorMessage } from '../src/services/api';
import { useToast } from '../src/components/ui/Toast';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm: z.string().min(1, 'Please confirm your password'),
  })
  .refine((d) => d.password === d.confirm, { message: 'Passwords do not match', path: ['confirm'] });

/** THE single login screen for every account type — the server decides the role. */
export default function Login() {
  const { login, register } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [mode, setMode] = useState('login');

  const loginForm = useForm({ resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' } });
  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirm: '' },
  });

  const onLogin = async (values) => {
    try {
      const user = await login(values.email.trim(), values.password);
      toast.show(`Welcome back, ${user.name}`, 'success');
      router.replace(user.role === 'admin' ? '/admin' : '/');
    } catch (error) {
      toast.show(apiErrorMessage(error, 'Invalid email or password'), 'error');
    }
  };

  /** Registration is OTP-verified — the account is created only after
   *  the emailed code is confirmed on the OTP screen. */
  const onRegister = async (values) => {
    try {
      const data = await registerInitiate(values.email.trim());
      setPendingAuth({ name: values.name.trim(), password: values.password });
      if (__DEV__ && data.devOtp) toast.show(`Dev OTP: ${data.devOtp}`, 'info', 8000);
      router.push({
        pathname: '/otp-verify',
        params: {
          purpose: 'register',
          email: values.email.trim(),
          otpId: data.otpId,
        },
      });
    } catch (error) {
      toast.show(apiErrorMessage(error, 'Could not start registration'), 'error');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-alt">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerClassName="flex-grow justify-center px-6 py-8">
          <View className="mb-8 items-center">
            <View className="h-20 w-20 items-center justify-center rounded-3xl bg-primary-600">
              <Text className="text-3xl font-black text-white">M</Text>
            </View>
            <Text className="mt-3 text-2xl font-black text-ink">Modern Public School</Text>
            <Text className="mt-1 text-sm text-ink-muted">
              {mode === 'login' ? 'Sign in to continue' : 'Create your account'}
            </Text>
          </View>

          {mode === 'login' ? (
            <View>
              <Controller
                control={loginForm.control}
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
              <Controller
                control={loginForm.control}
                name="password"
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <Input label="Password" placeholder="••••••••" secure value={value} onChangeText={onChange} error={error?.message} />
                )}
              />
              <Pressable onPress={() => router.push('/forgot-password')} className="mb-4 self-end">
                <Text className="text-[13px] font-bold text-primary-600">Forgot password?</Text>
              </Pressable>
              <Button
                title="Sign In"
                size="lg"
                className="mt-2"
                loading={loginForm.formState.isSubmitting}
                onPress={loginForm.handleSubmit(onLogin)}
              />
              <View className="mt-5 flex-row justify-center">
                <Text className="text-sm text-ink-muted">New here? </Text>
                <Pressable onPress={() => setMode('register')}>
                  <Text className="text-sm font-bold text-primary-600">Create an account</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <View>
              {[
                { name: 'name', label: 'Full name', placeholder: 'Your name' },
                { name: 'email', label: 'Email', placeholder: 'you@example.com', email: true },
                { name: 'password', label: 'Password', placeholder: 'At least 8 characters', secure: true },
                { name: 'confirm', label: 'Confirm password', placeholder: 'Repeat your password', secure: true },
              ].map((f) => (
                <Controller
                  key={f.name}
                  control={registerForm.control}
                  name={f.name}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <Input
                      label={f.label}
                      placeholder={f.placeholder}
                      secure={f.secure}
                      keyboardType={f.email ? 'email-address' : 'default'}
                      autoCapitalize={f.email ? 'none' : 'sentences'}
                      autoCorrect={false}
                      value={value}
                      onChangeText={onChange}
                      error={error?.message}
                    />
                  )}
                />
              ))}
              <Button
                title="Create Account"
                size="lg"
                className="mt-2"
                loading={registerForm.formState.isSubmitting}
                onPress={registerForm.handleSubmit(onRegister)}
              />
              <View className="mt-5 flex-row justify-center">
                <Text className="text-sm text-ink-muted">Already have an account? </Text>
                <Pressable onPress={() => setMode('login')}>
                  <Text className="text-sm font-bold text-primary-600">Sign in</Text>
                </Pressable>
              </View>
            </View>
          )}

          <Pressable onPress={() => router.back()} className="mt-8 items-center">
            <Text className="text-sm font-semibold text-ink-muted">Continue browsing as guest</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
