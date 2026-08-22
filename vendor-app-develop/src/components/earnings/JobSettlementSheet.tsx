import { Check, ExternalLink, X } from 'lucide-react-native';
import { Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { formatRupees } from '@/lib/utils';
import type { JobSettlement, JobTypeKey } from '@/src/types/earnings';
import { colors } from '@/src/theme/colors';

const JOB_TYPE_STYLE: Record<JobTypeKey, { bg: string; text: string }> = {
  rateCard:   { bg: colors.jobType.rateCard.bg,   text: colors.jobType.rateCard.text   },
  service:    { bg: colors.jobType.service.bg,    text: colors.jobType.service.text    },
  highTicket: { bg: colors.jobType.highTicket.bg, text: colors.jobType.highTicket.text },
};

function SummaryRow({
  label,
  sublabel,
  value,
  valueColor,
}: {
  label: string;
  sublabel?: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <View className="flex-row items-center justify-between py-3 border-b border-zn-border">
      <View>
        <Text className="text-body-sm font-medium text-ink-900">{label}</Text>
        {sublabel ? <Text className="text-caption text-ink-500 mt-0.5">{sublabel}</Text> : null}
      </View>
      <Text
        className="text-body-sm font-bold"
        style={{ color: valueColor ?? colors.ink[900] }}
      >
        {value}
      </Text>
    </View>
  );
}

export function JobSettlementSheet({
  job,
  onClose,
  onViewDetail,
}: {
  job: JobSettlement | null;
  onClose: () => void;
  onViewDetail?: (job: JobSettlement) => void;
}) {
  const insets = useSafeAreaInsets();
  if (!job) return null;

  const typeStyle = JOB_TYPE_STYLE[job.jobTypeKey];

  return (
    <Modal visible={!!job} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1" style={{ backgroundColor: 'rgba(14,26,31,0.55)' }}>
        <Pressable className="flex-1" onPress={onClose} />
        <View
          className="bg-surface-card rounded-t-[20px] px-4 pt-3"
          style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}
        >
          <View className="w-10 h-1 rounded-full bg-ink-200 self-center mb-4" />

          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-h3 font-semibold text-ink-900">Job settlement</Text>
            <Pressable
              onPress={onClose}
              className="w-8 h-8 rounded-full bg-surface-app items-center justify-center"
            >
              <X size={16} color={colors.ink[700]} />
            </Pressable>
          </View>

          <View className="flex-row items-center gap-2 mb-3">
            <View className="rounded-full px-2.5 py-1" style={{ backgroundColor: typeStyle.bg }}>
              <Text className="text-label font-bold" style={{ color: typeStyle.text }}>
                {job.jobTypeLabel}
              </Text>
            </View>
            <View className="flex-row items-center gap-1 rounded-full px-2.5 py-1" style={{ backgroundColor: colors.status.available.bg }}>
              <Check size={12} color={colors.status.available.text} />
              <Text className="text-label font-bold" style={{ color: colors.status.available.text }}>
                Settled
              </Text>
            </View>
          </View>

          <Text className="text-h3 font-bold text-ink-900 mb-0.5">{job.name}</Text>
          <Text className="text-body-sm text-ink-500 mb-4">
            {job.technicianName} · {job.date} · {job.time}
          </Text>

          <View className="bg-surface-app rounded-[12px] px-4 mb-5">
            <SummaryRow
              label="Customer paid"
              sublabel={job.paymentMethod}
              value={formatRupees(job.grossAmount)}
            />
            <SummaryRow
              label="Platform fee (20%)"
              value={`–${formatRupees(job.platformFee)}`}
              valueColor={colors.status.offline.dot}
            />
            <View className="flex-row items-center justify-between pt-3 pb-3">
              <Text className="text-body-sm font-bold text-ink-900">Net to vendor</Text>
              <Text className="text-body-sm font-bold text-ink-900">{formatRupees(job.netAmount)}</Text>
            </View>
          </View>

          <Pressable
            onPress={() => onViewDetail?.(job)}
            className="flex-row items-center justify-center gap-2 rounded-[12px] border"
            style={{ borderColor: colors.border.default, height: 52 }}
          >
            <ExternalLink size={17} color={colors.ink[700]} />
            <Text className="text-title font-semibold text-ink-900">View full job detail</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
