import { AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { formatRupees } from '@/lib/utils';
import { scopeChangeReasonLabel } from '@/src/data/scopeChangeReasons';
import { colors } from '@/src/theme/colors';
import type { ScopeChange } from '@/src/types/jobs';

type ScopeChangeCardProps = {
  scopeChange: ScopeChange;
};

const STATUS_CONFIG = {
  approved: {
    label: 'Approved',
    bg: colors.status.available.bg,
    text: colors.status.available.text,
    Icon: CheckCircle,
  },
  pending: {
    label: 'Awaiting customer',
    bg: colors.status.offDuty.bg,
    text: colors.status.offDuty.text,
    Icon: Clock,
  },
  declined: {
    label: 'Declined',
    bg: colors.status.offline.bg,
    text: colors.status.offline.text,
    Icon: XCircle,
  },
  expired: {
    label: 'Expired',
    bg: colors.status.offline.bg,
    text: colors.status.offline.text,
    Icon: XCircle,
  },
};

export function ScopeChangeCard({ scopeChange }: ScopeChangeCardProps) {
  const cfg = STATUS_CONFIG[scopeChange.status];
  const StatusIcon = cfg.Icon;

  return (
    <View className="mx-4 mt-4">
      <Text
        className="mb-2 text-micro font-bold uppercase text-ink-500"
        style={{ letterSpacing: 0.8 }}>
        Scope Change
      </Text>
      <View className="gap-3 rounded-[14px] border border-zn-border bg-surface-card p-4">
        <View className="flex-row items-start justify-between gap-2">
          <View className="flex-1 flex-row items-center gap-2">
            <View
              className="h-8 w-8 items-center justify-center rounded-[8px]"
              style={{ backgroundColor: colors.status.enRoute.bg }}>
              <AlertCircle size={15} color={colors.status.enRoute.text} strokeWidth={2} />
            </View>
            <Text className="flex-1 text-body-sm font-bold text-ink-900">
              {scopeChangeReasonLabel(scopeChange.reason)}
            </Text>
          </View>

          <View
            className="flex-row items-center gap-1 rounded-[999px] px-2.5 py-[5px]"
            style={{ backgroundColor: cfg.bg }}>
            <StatusIcon size={11} color={cfg.text} strokeWidth={2.5} />
            <Text className="text-micro font-semibold" style={{ color: cfg.text }}>
              {cfg.label}
            </Text>
          </View>
        </View>

        <Text className="text-body-sm font-medium leading-5 text-ink-600">
          {scopeChange.description}
        </Text>

        <View
          className="gap-2 rounded-[10px] p-3"
          style={{ backgroundColor: colors.surface.sunken }}>
          <View className="flex-row items-center justify-between">
            <Text className="text-caption font-medium text-ink-500">Original amount</Text>
            <Text className="text-body-sm font-semibold text-ink-900">
              {formatRupees(scopeChange.originalAmount)}
            </Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-caption font-medium text-ink-500">Additional charge</Text>
            <Text
              className="text-body-sm font-semibold"
              style={{ color: colors.status.enRoute.text }}>
              + {formatRupees(scopeChange.additionalAmount)}
            </Text>
          </View>
          <View className="h-px" style={{ backgroundColor: colors.border.subtle }} />
          <View className="flex-row items-center justify-between">
            <Text className="text-body-sm font-bold text-ink-900">Revised total</Text>
            <Text className="text-body-sm font-extrabold text-ink-900">
              {formatRupees(scopeChange.revisedTotal)}
            </Text>
          </View>
        </View>

        <Text className="text-caption font-medium text-ink-400">
          Raised at {scopeChange.raisedAt}
        </Text>
      </View>
    </View>
  );
}
