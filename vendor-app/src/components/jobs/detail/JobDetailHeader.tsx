import { ChevronLeft } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { JOB_STATUS_CONFIG } from '@/src/components/jobs/jobConfig';
import { colors } from '@/src/theme/colors';
import type { JobStatus } from '@/src/types/jobs';

type JobDetailHeaderProps = {
  jobNumber: string;
  jobStatus: JobStatus;
  onBack: () => void;
};

export function JobDetailHeader({ jobNumber, jobStatus, onBack }: JobDetailHeaderProps) {
  const insets = useSafeAreaInsets();
  const statusCfg = JOB_STATUS_CONFIG[jobStatus];
  const StatusIcon = statusCfg.Icon;

  return (
    <View
      className="flex-row items-center bg-surface-card border-b border-zn-border px-1"
      style={{ paddingTop: insets.top + 4, paddingBottom: 10 }}
    >
      <Pressable
        onPress={onBack}
        className="min-w-[48px] min-h-[48px] items-center justify-center"
      >
        <ChevronLeft size={24} color={colors.ink[900]} strokeWidth={2} />
      </Pressable>

      <View className="flex-1 min-w-0">
        <Text className="text-title font-bold text-ink-900" style={{ letterSpacing: -0.2 }}>
          Job detail
        </Text>
        <Text className="text-caption font-medium mt-[1px]" style={{ color: colors.brand.accent }}>
          {jobNumber}
        </Text>
      </View>

      <View
        className="flex-row items-center gap-1.5 mr-4 px-3 py-[6px] rounded-[999px]"
        style={{ backgroundColor: statusCfg.bg }}
      >
        <StatusIcon size={13} color={statusCfg.text} strokeWidth={2.5} />
        <Text className="text-label font-semibold" style={{ color: statusCfg.text }}>
          {statusCfg.label}
        </Text>
      </View>
    </View>
  );
}
