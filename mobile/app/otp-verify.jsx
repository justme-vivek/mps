import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, TextInput, View } from 'react-native';
import Text from '../src/components/ui/Text';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { useAuth } from '../src/features/auth/AuthContext';
import { useToast } from '../src/components/ui/Toast';
import { apiErrorMessage } from '../src/services/api';
import {
  changePasswordConfirm,
  changePasswordInitiate,
  forgotPasswordInitiate,
  forgotPasswordVerify,
  registerInitiate,
  registerVerify,
} from '../src/features/auth/authService';
import { takePendingAuth } from '../src/utils/pendingAuth';

/**
 * Reusable OTP screen for all three flows:
 *  - register: verifies, creates the account, logs in, routes by role
 *  - reset:    verifies, hands the single-use resetToken to /new-password
 *  - change:   verifies + saves the new password (from pendingAuth), then
 *              forces a fresh sign-in (all old sessions are invalidated)
 */
export default function OtpVerify() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const purpose = params.purpose; // 'register' | 'reset' | 'change'
  const email = params.email || '';
  const { adoptSession, logout } = useAuth();
  const toast = useToast();

  const [otpId, setOtpId] = useState(params.otpId || '');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [resendIn, setResendIn] = useState(60);

  useEffect(() => {
    if (resendIn <= 0) return undefined;
    const timer = setInterval(() => setResendIn((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [resendIn]);

  const onVerify = async (submitted) => {
    const value = submitted || code;
    if (value.length !== 6 || busy) return;
    setBusy(true);
    try {
      if (purpose === 'register') {
        const pending = takePendingAuth(); // { name, password }
        if (!pending) {
          toast.show('Registration session lost. Please sign up again.', 'error');
          router.replace('/login');
          return;
        }
        const session = await registerVerify({
          otpId,
          code: value,
          name: pending.name,
          password: pending.password,
        });
        await adoptSession(session);
        toast.show(`Welcome, ${session.name}!`, 'success');
        router.replace(session.role === 'admin' ? '/admin' : '/');
      } else if (purpose === 'reset') {
        const { resetToken } = await forgotPasswordVerify({ otpId, code: value });
        setPendingAuth({ resetToken });
        router.push('/new-password');
      } else if (purpose === 'change') {
        const pending = takePendingAuth(); // { password }
        if (!pending?.password) {
          toast.show('Something went wrong. Please try again.', 'error');
          router.back();
          return;
        }
        const result = await changePasswordConfirm({
          otpId,
          code: value,
          password: pending.password,
        });
        toast.show(result.message || 'Password changed.', 'success');
        await logout();
        router.replace('/login');
      }
    } catch (error) {
      toast.show(apiErrorMessage(error, 'Verification failed'), 'error');
      setCode('');
    } finally {
      setBusy(false);
    }
  };

  const onResend = async () => {
    setBusy(true);
    try {
      let result;
      if (purpose === 'register') result = await registerInitiate(email);
      else if (purpose === 'reset') result = await forgotPasswordInitiate(email);
      else result = await changePasswordInitiate();
      setOtpId(result.otpId);
      setResendIn(60);
      toast.show('A new code has been sent.', 'success');
      if (__DEV__ && result.devOtp) toast.show(`Dev OTP: ${result.devOtp}`, 'info', 8000);
    } catch (error) {
      toast.show(apiErrorMessage(error, 'Could not resend the code'), 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleChange = (text) => {
    const value = text.replace(/\D/g, '').slice(0, 6);
    setCode(value);
    if (value.length === 6) onVerify(value);
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

        <Text accessibilityRole="header" className="mt-6 font-serif text-[28px] leading-9 text-ink">Enter the code</Text>
        <Text className="mt-1 text-[14px] leading-5 text-ink-muted">
          We sent a 6-digit code to{'\n'}
          <Text className="font-bold text-ink">{email}</Text>
        </Text>

        {/* 6 code boxes — the real input sits invisibly on top */}
        <View className="relative mt-8">
          <TextInput
            value={code}
            onChangeText={handleChange}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            maxLength={6}
            autoFocus
            editable={!busy}
            className="absolute inset-0 h-14 opacity-0"
          />
          <View className="flex-row justify-center" pointerEvents="none">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <View
                key={i}
                className={`h-14 w-11 items-center justify-center rounded-xl border-[1.5px] ${
                  code.length === i ? 'border-primary-600 bg-primary-50' : 'border-line bg-surface'
                }`}
              >
                <Text className="text-2xl font-extrabold text-ink">{code[i] ? '•' : ''}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="mt-6 h-6 items-center">
          {busy ? (
            <ActivityIndicator color="#2A44B8" />
          ) : (
            <Text className="text-[13px] text-ink-faint">
              {code.length === 6 ? 'Verifying…' : 'The code verifies automatically.'}
            </Text>
          )}
        </View>

        <View className="mt-2 flex-row justify-center">
          {resendIn > 0 ? (
            <Text className="text-[13px] text-ink-muted">Resend code in {resendIn}s</Text>
          ) : (
            <Pressable onPress={onResend} disabled={busy}>
              <Text className="text-[13px] font-bold text-primary-600">Resend code</Text>
            </Pressable>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
