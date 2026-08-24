import { ArrowLeft } from 'lucide-react-native';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { formatRupees } from '@/lib/utils';
import { SCOPE_CHANGE_REASONS, SCOPE_CHANGE_TIME_OPTIONS } from '@/src/data/scopeChangeReasons';
import { useTechnicianDashboardStore } from '@/src/store/technicianDashboardStore';
import { colors } from '@/src/theme/colors';
import type { JobTypeKey } from '@/src/types/technician';

type ScopeChangeFormScreenProps = {
  jobId: string;
  jobTypeKey: JobTypeKey;
  originalAmount: number;
  onDone: () => void;
  onCancel: () => void;
};

// SRS §9.2 steps 2-3: form, then a preview before sending to the customer for approval.
export function ScopeChangeFormScreen({
  jobId,
  jobTypeKey,
  originalAmount,
  onDone,
  onCancel,
}: ScopeChangeFormScreenProps) {
  const [step, setStep] = useState<'form' | 'preview'>('form');
  const [reason, setReason] = useState<string>(SCOPE_CHANGE_REASONS[0].value);
  const [description, setDescription] = useState('');
  const [additionalMinutes, setAdditionalMinutes] = useState<number | null>(null);
  const [additionalAmount, setAdditionalAmount] = useState('');

  const reportScopeChange = useTechnicianDashboardStore((state) => state.reportScopeChange);
  const reportingScopeChangeJobId = useTechnicianDashboardStore(
    (state) => state.reportingScopeChangeJobId
  );
  const scopeChangeError = useTechnicianDashboardStore((state) => state.scopeChangeError);
  const submitting = reportingScopeChangeJobId === jobId;

  const amountValue = parseFloat(additionalAmount);
  const canContinue = description.trim().length > 0 && amountValue > 0;

  async function handleSend() {
    const ok = await reportScopeChange(jobId, {
      reason,
      description: description.trim(),
      additionalMinutes: jobTypeKey === 'rateCard' ? (additionalMinutes ?? undefined) : undefined,
      additionalAmount: amountValue,
    });
    if (ok) onDone();
    else
      Alert.alert(
        'Send failed',
        scopeChangeError ?? 'Could not send the scope change. Please try again.'
      );
  }

  if (step === 'preview') {
    const revisedTotal = originalAmount + amountValue;
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-row items-center gap-3 px-4 pb-3 pt-2">
          <Pressable
            onPress={() => setStep('form')}
            accessibilityRole="button"
            className="h-10 w-10 items-center justify-center rounded-full border border-zn-border">
            <ArrowLeft size={20} color={colors.ink[900]} />
          </Pressable>
          <Text className="flex-1 text-h3 font-extrabold text-ink-900">Review Scope Change</Text>
        </View>

        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
          <View className="mt-2 gap-2 rounded-[14px] border border-zn-border p-4">
            <Text className="text-caption font-medium text-ink-500">Reason</Text>
            <Text className="text-body font-semibold text-ink-900">
              {SCOPE_CHANGE_REASONS.find((r) => r.value === reason)?.label}
            </Text>
            <Text className="mt-2 text-caption font-medium text-ink-500">Description</Text>
            <Text className="text-body text-ink-900">{description}</Text>
            {additionalMinutes ? (
              <>
                <Text className="mt-2 text-caption font-medium text-ink-500">Additional time</Text>
                <Text className="text-body text-ink-900">{additionalMinutes} min</Text>
              </>
            ) : null}
          </View>

          <View
            className="mt-4 gap-2 rounded-[10px] p-3"
            style={{ backgroundColor: colors.surface.sunken }}>
            <View className="flex-row items-center justify-between">
              <Text className="text-caption font-medium text-ink-500">Original amount</Text>
              <Text className="text-body-sm font-semibold text-ink-900">
                {formatRupees(originalAmount)}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-caption font-medium text-ink-500">Additional charge</Text>
              <Text
                className="text-body-sm font-semibold"
                style={{ color: colors.status.enRoute.text }}>
                + {formatRupees(amountValue)}
              </Text>
            </View>
            <View className="h-px" style={{ backgroundColor: colors.border.subtle }} />
            <View className="flex-row items-center justify-between">
              <Text className="text-body-sm font-bold text-ink-900">Revised total</Text>
              <Text className="text-body-sm font-extrabold text-ink-900">
                {formatRupees(revisedTotal)}
              </Text>
            </View>
          </View>

          <Text className="mt-4 text-caption text-ink-400">
            The customer will have 10 minutes to approve or decline this once sent.
          </Text>
          <View className="h-6" />
        </ScrollView>

        <View className="border-t border-zn-border px-4 pb-6 pt-3">
          <Pressable
            onPress={handleSend}
            disabled={submitting}
            accessibilityRole="button"
            className="h-12 items-center justify-center rounded-xl"
            style={{ backgroundColor: colors.brand.header, opacity: submitting ? 0.6 : 1 }}>
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-body font-bold text-white">Send to Customer</Text>
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center gap-3 px-4 pb-3 pt-2">
        <Pressable
          onPress={onCancel}
          accessibilityRole="button"
          className="h-10 w-10 items-center justify-center rounded-full border border-zn-border">
          <ArrowLeft size={20} color={colors.ink[900]} />
        </Pressable>
        <Text className="flex-1 text-h3 font-extrabold text-ink-900">Report Scope Change</Text>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <View className="mt-2">
          <Text
            className="mb-1 text-micro font-bold uppercase text-ink-500"
            style={{ letterSpacing: 0.8 }}>
            Reason
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {SCOPE_CHANGE_REASONS.map((r) => {
              const active = r.value === reason;
              return (
                <Pressable
                  key={r.value}
                  onPress={() => setReason(r.value)}
                  accessibilityRole="button"
                  className="rounded-full px-3 py-2"
                  style={{
                    backgroundColor: active ? colors.pill.selectedBg : colors.pill.defaultBg,
                    borderWidth: active ? 0 : 1,
                    borderColor: colors.pill.defaultBorder,
                  }}>
                  <Text
                    className="text-caption font-semibold"
                    style={{ color: active ? colors.pill.selectedText : colors.pill.defaultText }}>
                    {r.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className="mt-4">
          <Text
            className="mb-1 text-micro font-bold uppercase text-ink-500"
            style={{ letterSpacing: 0.8 }}>
            Description
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="What was found, what additional work is needed"
            placeholderTextColor={colors.ink[400]}
            multiline
            numberOfLines={4}
            className="min-h-[96px] rounded-[10px] border px-3 py-3 text-body text-ink-900"
            style={{ borderColor: colors.border.subtle, textAlignVertical: 'top' }}
          />
        </View>

        {jobTypeKey === 'rateCard' ? (
          <View className="mt-4">
            <Text
              className="mb-1 text-micro font-bold uppercase text-ink-500"
              style={{ letterSpacing: 0.8 }}>
              Additional time needed
            </Text>
            <View className="flex-row gap-2">
              {SCOPE_CHANGE_TIME_OPTIONS.map((mins) => {
                const active = additionalMinutes === mins;
                return (
                  <Pressable
                    key={mins}
                    onPress={() => setAdditionalMinutes(active ? null : mins)}
                    accessibilityRole="button"
                    className="rounded-full px-4 py-2"
                    style={{
                      backgroundColor: active ? colors.pill.selectedBg : colors.pill.defaultBg,
                      borderWidth: active ? 0 : 1,
                      borderColor: colors.pill.defaultBorder,
                    }}>
                    <Text
                      className="text-caption font-semibold"
                      style={{
                        color: active ? colors.pill.selectedText : colors.pill.defaultText,
                      }}>
                      {mins} min
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : null}

        <View className="mt-4">
          <Text
            className="mb-1 text-micro font-bold uppercase text-ink-500"
            style={{ letterSpacing: 0.8 }}>
            Revised price — additional amount
          </Text>
          <TextInput
            value={additionalAmount}
            onChangeText={setAdditionalAmount}
            placeholder="0"
            placeholderTextColor={colors.ink[400]}
            keyboardType="numeric"
            className="rounded-[10px] border px-3 py-3 text-body text-ink-900"
            style={{ borderColor: colors.border.subtle }}
          />
        </View>

        <View className="h-6" />
      </ScrollView>

      <View className="border-t border-zn-border px-4 pb-6 pt-3">
        <Pressable
          onPress={() => setStep('preview')}
          disabled={!canContinue}
          accessibilityRole="button"
          className="h-12 items-center justify-center rounded-xl"
          style={{ backgroundColor: colors.brand.header, opacity: canContinue ? 1 : 0.5 }}>
          <Text className="text-body font-bold text-white">Review</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
