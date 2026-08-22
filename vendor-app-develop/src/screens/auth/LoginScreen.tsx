import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { cn } from '@/lib/utils';
import { useAuthStore } from '@/src/store/authStore';

const PHONE_LENGTH = 10;

type LoginScreenProps = {
  onOtpSent: () => void;
};

export function LoginScreen({ onOtpSent }: LoginScreenProps) {
  const phone = useAuthStore((state) => state.phone);
  const isSendingOtp = useAuthStore((state) => state.isSendingOtp);
  const error = useAuthStore((state) => state.error);
  const setPhone = useAuthStore((state) => state.setPhone);
  const sendOtp = useAuthStore((state) => state.sendOtp);

  const isValidPhone = phone.length === PHONE_LENGTH;
  const canSubmit = isValidPhone && !isSendingOtp;

  async function handleSendOtp() {
    if (!canSubmit) return;
    const success = await sendOtp();
    if (success) onOtpSent();
  }

  return (
    <View className="flex-1 bg-brand-header">
      <SafeAreaView className="flex-1">
        <View className="items-center pb-10 pt-8">
          <View className="h-14 w-14 items-center justify-center rounded-2xl border-2 border-white/40 bg-white/10">
            <Text className="text-h1 font-bold text-white">Z</Text>
          </View>
          <Text className="mt-3 text-h1 font-bold text-white">ZepNest Partner App</Text>
        </View>

        <View className="flex-1 rounded-t-[28px] bg-white px-6 pb-6 pt-8">
          <Text className="text-h1 font-extrabold text-ink-900">Sign in</Text>

          <Text className="mt-8 text-caption font-semibold text-ink-500">Mobile Number</Text>
          <View className="mt-2 h-12 flex-row items-center rounded-lg border border-zn-border px-3">
            <Text className="text-body font-semibold text-ink-900">+91</Text>
            <View className="mx-3 h-6 w-px bg-zn-border" />
            <TextInput
              value={phone}
              onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, '').slice(0, PHONE_LENGTH))}
              placeholder="Enter mobile number"
              placeholderTextColor="#8C9AA0"
              keyboardType="number-pad"
              maxLength={PHONE_LENGTH}
              className="flex-1 text-body text-ink-900"
            />
          </View>
          <Text className="mt-2 text-caption text-ink-500">
            We&apos;ll text you a 6-digit code.
          </Text>

          {error ? (
            <Text className="mt-2 text-caption text-status-offlineText">{error}</Text>
          ) : null}

          <View className="flex-1" />

          <Pressable
            onPress={handleSendOtp}
            disabled={!canSubmit}
            accessibilityRole="button"
            className={cn(
              'h-12 items-center justify-center rounded-xl',
              canSubmit ? 'bg-brand-header' : 'bg-zn-border'
            )}>
            {isSendingOtp ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text
                className={cn('text-body font-bold', canSubmit ? 'text-white' : 'text-ink-500')}>
                Send OTP
              </Text>
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
