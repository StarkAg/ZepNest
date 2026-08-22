import { X } from 'lucide-react-native';
import { Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { formatRupees } from '@/lib/utils';
import { AvatarInitials } from '@/src/components/ui/AvatarInitials';
import type { TechnicianEarning } from '@/src/types/earnings';
import { colors } from '@/src/theme/colors';

function MetricTile({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 rounded-[10px] bg-surface-app p-3">
      <Text className="text-[11px] font-bold text-ink-500 mb-1" style={{ letterSpacing: 0.7 }}>
        {label}
      </Text>
      <Text className="text-num-md font-bold text-ink-900">{value}</Text>
    </View>
  );
}

function SummaryRow({
  label,
  value,
  valueColor,
  bold,
}: {
  label: string;
  value: string;
  valueColor?: string;
  bold?: boolean;
}) {
  return (
    <View className="flex-row items-center justify-between py-3 border-b border-zn-border">
      <Text className={bold ? 'text-body-sm font-bold text-ink-900' : 'text-body-sm font-medium text-ink-900'}>
        {label}
      </Text>
      <Text
        className={bold ? 'text-body-sm font-bold' : 'text-body-sm font-semibold'}
        style={{ color: valueColor ?? colors.ink[900] }}
      >
        {value}
      </Text>
    </View>
  );
}

export function TechnicianEarningsSheet({
  technician,
  onClose,
}: {
  technician: TechnicianEarning | null;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  if (!technician) return null;

  return (
    <Modal visible={!!technician} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1" style={{ backgroundColor: 'rgba(14,26,31,0.55)' }}>
        <Pressable className="flex-1" onPress={onClose} />
        <View
          className="bg-surface-card rounded-t-[20px] px-4 pt-3"
          style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}
        >
          <View className="w-10 h-1 rounded-full bg-ink-200 self-center mb-4" />

          <View className="flex-row items-center justify-between mb-5">
            <Text className="text-h3 font-semibold text-ink-900">{technician.name}</Text>
            <Pressable
              onPress={onClose}
              className="w-8 h-8 rounded-full bg-surface-app items-center justify-center"
            >
              <X size={16} color={colors.ink[700]} />
            </Pressable>
          </View>

          <View className="flex-row items-center gap-3 mb-5">
            <AvatarInitials
              initials={technician.initials}
              avatarColor={technician.avatarColor}
              size="md"
            />
            <View>
              <Text className="text-title font-bold text-ink-900">{technician.name}</Text>
              <Text className="text-body-sm text-ink-500">{technician.specialties}</Text>
            </View>
          </View>

          <View className="flex-row gap-3 mb-5">
            <MetricTile label="JOBS DONE" value={String(technician.jobsDone)} />
            <MetricTile label="AVG / JOB" value={formatRupees(technician.avgPerJob)} />
          </View>

          <View className="bg-surface-app rounded-[12px] px-4">
            <SummaryRow
              label="Gross billed"
              value={formatRupees(technician.grossAmount)}
            />
            <SummaryRow
              label="Platform fee (20%)"
              value={`–${formatRupees(technician.platformFee)}`}
              valueColor={colors.status.offline.dot}
            />
            <View className="flex-row items-center justify-between pt-3 pb-3">
              <Text className="text-body-sm font-bold text-ink-900">Net contribution</Text>
              <Text className="text-body-sm font-bold text-ink-900">{formatRupees(technician.netAmount)}</Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
