import { ArrowLeft } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { cn } from '@/lib/utils';
import { OtpInput } from '@/src/components/ui/OtpInput';
import { useCountdown } from '@/src/hooks/useCountdown';
import { useAuthStore } from '@/src/store/authStore';
import type { AuthRole, VerifyOtpResult } from '@/src/types/auth';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

type OtpScreenProps = {
  onBack: () => void;
  onEdit: () => void;
  onVerified: (roles: AuthRole[], user: VerifyOtpResult['user']) => void;
};

function maskPhone(phone: string): string {
  if (phone.length <= 5) return phone;
  return `${phone.slice(0, 5)} ${'•'.repeat(phone.length - 5)}`;
}

function formatCountdown(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes}:${remaining.toString().padStart(2, '0')}`;
}

export function OtpScreen({ onBack, onEdit, onVerified }: OtpScreenProps) {
  const phone = useAuthStore((state) => state.phone);
  const isVerifyingOtp = useAuthStore((state) => state.isVerifyingOtp);
  const error = useAuthStore((state) => state.error);
  const verifyOtp = useAuthStore((state) => state.verifyOtp);
  const sendOtp = useAuthStore((state) => state.sendOtp);
  const clearError = useAuthStore((state) => state.clearError);

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const { secondsLeft, reset } = useCountdown(RESEND_SECONDS);

  const code = otp.join('');
  const canVerify = code.length === OTP_LENGTH && !isVerifyingOtp;

  async function handleVerify() {
    if (!canVerify) return;
    const result = await verifyOtp(code);
    if (!result) return;

    const isPartner = result.roles.some((r) => r === 'vendor' || r === 'technician');
    if (!isPartner) {
      setOtp(Array(OTP_LENGTH).fill(''));
      useAuthStore.setState({ error: 'This number is not registered as a ZepNest partner.' });
      return;
    }
    clearError();
    onVerified(result.roles, result.user);
  }

  async function handleResend() {
    if (secondsLeft > 0) return;
    setOtp(Array(OTP_LENGTH).fill(''));
    reset();
    await sendOtp();
  }

  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      <Pressable
        onPress={onBack}
        accessibilityRole="button"
        className="mt-4 h-10 w-10 items-center justify-center rounded-full border border-zn-border">
        <ArrowLeft size={20} color="#0E1A1F" />
      </Pressable>

      <Text className="mt-6 text-h1 font-extrabold text-ink-900">Verify your number</Text>
      <View className="mt-2 flex-row items-center gap-1.5">
        <Text className="text-body text-ink-500">Code sent to</Text>
        <Text className="text-body font-bold text-ink-900">+91 {maskPhone(phone)}</Text>
        <Pressable onPress={onEdit} accessibilityRole="button" hitSlop={8}>
          <Text className="text-body font-semibold text-brand-accent">Edit</Text>
        </Pressable>
      </View>

      <View className="mt-8">
        <OtpInput value={otp} onChange={setOtp} />
      </View>

      <View className="mt-4 flex-row items-center gap-2 self-start rounded-full bg-brand-soft px-3 py-1.5">
        <View className="h-2 w-2 rounded-full bg-brand-accent" />
        <Text className="text-caption font-medium text-brand-accent">Auto-reading SMS code...</Text>
      </View>

      {error ? <Text className="mt-4 text-caption text-status-offlineText">{error}</Text> : null}

      <View className="flex-1" />

      <View className="items-center pb-2">
        {secondsLeft > 0 ? (
          <Text className="text-caption text-ink-500">
            Didn&apos;t get it? Resend in{' '}
            <Text className="font-bold text-ink-900">{formatCountdown(secondsLeft)}</Text>
          </Text>
        ) : (
          <Pressable onPress={handleResend} accessibilityRole="button" hitSlop={8}>
            <Text className="text-caption font-semibold text-brand-accent">Resend code</Text>
          </Pressable>
        )}
      </View>

      <Pressable
        onPress={handleVerify}
        disabled={!canVerify}
        accessibilityRole="button"
        className={cn(
          'mb-6 h-12 items-center justify-center rounded-xl',
          canVerify ? 'bg-brand-header' : 'bg-zn-border'
        )}>
        {isVerifyingOtp ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text className={cn('text-body font-bold', canVerify ? 'text-white' : 'text-ink-500')}>
            Verify & continue
          </Text>
        )}
      </Pressable>
    </SafeAreaView>
  );
}
