import { ShieldCheck } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, Text, TextInput, View } from 'react-native';

import { useTechnicianDashboardStore } from '@/src/store/technicianDashboardStore';
import { colors } from '@/src/theme/colors';

const OTP_TTL_SECONDS = 600; // FR-T1-004 — fixed 10-minute validity, mirrors the backend constant.

type OtpEntrySheetProps = {
  jobId: string;
  visible: boolean;
  onClose: () => void;
};

// FR-T1-004: technician requests a 4-digit customer completion OTP, then enters it here to close
// the job. Bottom-sheet modal (not a full route) — the technician typically stays on the job
// screen reading the code off the customer's phone. Mirrors GoOfflineSheet's structure.
export function OtpEntrySheet({ jobId, visible, onClose }: OtpEntrySheetProps) {
  const [otpInput, setOtpInput] = useState('');
  const [requested, setRequested] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(OTP_TTL_SECONDS);
  const requestOtp = useTechnicianDashboardStore((state) => state.requestOtp);
  const verifyOtp = useTechnicianDashboardStore((state) => state.verifyOtp);
  const requestingOtpJobId = useTechnicianDashboardStore((state) => state.requestingOtpJobId);
  const verifyingOtpJobId = useTechnicianDashboardStore((state) => state.verifyingOtpJobId);
  const otpDebug = useTechnicianDashboardStore((state) => state.otpDebug);
  const otpError = useTechnicianDashboardStore((state) => state.otpError);
  const requesting = requestingOtpJobId === jobId;
  const verifying = verifyingOtpJobId === jobId;

  useEffect(() => {
    if (!visible) {
      setOtpInput('');
      setRequested(false);
      setSecondsLeft(OTP_TTL_SECONDS);
    }
  }, [visible]);

  useEffect(() => {
    if (!requested || secondsLeft <= 0) return;
    const id = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [requested, secondsLeft]);

  // A 409 "max attempts" response means the technician must request a fresh code — drop back to
  // the request-only state rather than let them keep trying against a locked-out code.
  const maxAttemptsReached = otpError?.toLowerCase().includes('max attempts') ?? false;

  async function handleRequest() {
    setOtpInput('');
    const ok = await requestOtp(jobId);
    if (ok) {
      setRequested(true);
      setSecondsLeft(OTP_TTL_SECONDS);
    }
  }

  async function handleVerify() {
    const ok = await verifyOtp(jobId, otpInput);
    if (ok) onClose();
    else setOtpInput('');
  }

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const expired = requested && secondsLeft <= 0;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <Pressable className="absolute inset-0" onPress={onClose} accessibilityRole="button" />

        <View className="gap-1 rounded-t-[20px] bg-white p-6">
          <View className="mb-4 h-1 w-10 self-center rounded-full bg-zn-border" />

          <View
            className="h-12 w-12 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.status.onJob.bg }}>
            <ShieldCheck size={22} color={colors.status.onJob.dot} strokeWidth={2} />
          </View>

          <Text className="mt-4 text-h2 font-extrabold text-ink-900">Customer OTP</Text>
          <Text className="mt-2 text-body text-ink-500">
            Ask the customer for their 4-digit completion code to close this job.
          </Text>

          {otpDebug ? (
            <Text className="mt-2 text-caption font-semibold text-ink-500">
              Debug OTP: {otpDebug}
            </Text>
          ) : null}

          {requested ? (
            <>
              <Text className="mt-4 text-caption font-semibold text-ink-500">
                {expired
                  ? 'Code expired'
                  : `Expires in ${minutes}:${seconds.toString().padStart(2, '0')}`}
              </Text>
              <TextInput
                value={otpInput}
                onChangeText={(t) => setOtpInput(t.replace(/\D/g, '').slice(0, 4))}
                keyboardType="number-pad"
                maxLength={4}
                placeholder="0000"
                placeholderTextColor={colors.ink[300]}
                className="mt-2 h-14 rounded-xl border px-4 text-center text-h2 font-extrabold tracking-[8px] text-ink-900"
                style={{ borderColor: colors.border.default }}
              />
              {otpError ? (
                <Text
                  className="mt-2 text-caption font-semibold"
                  style={{ color: colors.status.offline.text }}>
                  {otpError}
                </Text>
              ) : null}
            </>
          ) : null}

          <View className="mt-6 flex-row gap-3">
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              className="h-12 flex-1 items-center justify-center rounded-xl border border-zn-border">
              <Text className="text-body font-bold text-ink-900">Close</Text>
            </Pressable>

            {!requested || expired || maxAttemptsReached ? (
              <Pressable
                onPress={handleRequest}
                disabled={requesting}
                accessibilityRole="button"
                className="h-12 flex-1 items-center justify-center rounded-xl"
                style={{ backgroundColor: colors.brand.header, opacity: requesting ? 0.7 : 1 }}>
                {requesting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text className="text-body font-bold text-white">
                    {requested ? 'Resend OTP' : 'Request OTP'}
                  </Text>
                )}
              </Pressable>
            ) : (
              <Pressable
                onPress={handleVerify}
                disabled={otpInput.length !== 4 || verifying}
                accessibilityRole="button"
                className="h-12 flex-1 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: colors.brand.header,
                  opacity: otpInput.length === 4 && !verifying ? 1 : 0.5,
                }}>
                {verifying ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text className="text-body font-bold text-white">Verify</Text>
                )}
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}
