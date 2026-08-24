import { ClipboardList, QrCode, Wrench } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { formatRupees } from '@/lib/utils';
import { SectionCard } from '@/src/components/earnings/SectionCard';
import type { JobSettlement, JobTypeKey } from '@/src/types/earnings';
import { colors } from '@/src/theme/colors';

const JOB_TYPE_STYLE: Record<JobTypeKey, { bg: string; iconColor: string }> = {
  rateCard:   { bg: colors.jobType.rateCard.bg,   iconColor: colors.jobType.rateCard.text   },
  service:    { bg: colors.jobType.service.bg,    iconColor: colors.jobType.service.text    },
  highTicket: { bg: colors.jobType.highTicket.bg, iconColor: colors.jobType.highTicket.text },
};

function JobTypeIcon({ typeKey }: { typeKey: JobTypeKey }) {
  const { bg, iconColor } = JOB_TYPE_STYLE[typeKey];
  const iconProps = { size: 16, color: iconColor };
  return (
    <View className="w-9 h-9 rounded-[8px] items-center justify-center" style={{ backgroundColor: bg }}>
      {typeKey === 'rateCard'   && <ClipboardList {...iconProps} />}
      {typeKey === 'service'    && <QrCode {...iconProps} />}
      {typeKey === 'highTicket' && <Wrench {...iconProps} />}
    </View>
  );
}

function JobRow({
  job,
  onPress,
}: {
  job: JobSettlement;
  onPress: (job: JobSettlement) => void;
}) {
  return (
    <Pressable
      onPress={() => onPress(job)}
      className="flex-row items-center px-4 py-3 border-t border-zn-border gap-3 active:opacity-70"
    >
      <JobTypeIcon typeKey={job.jobTypeKey} />
      <View className="flex-1 min-w-0">
        <Text className="text-body-sm font-semibold text-ink-900" numberOfLines={1}>
          {job.name}
        </Text>
        <Text className="text-caption text-ink-500 mt-0.5">
          {job.jobNumber} · {job.date} · {job.time}
        </Text>
      </View>
      <View className="items-end">
        <Text className="text-body-sm font-bold text-ink-900">{formatRupees(job.netAmount)}</Text>
        <Text className="text-caption text-ink-500">net of {formatRupees(job.grossAmount)}</Text>
      </View>
    </Pressable>
  );
}

export function PerJobSettlement({
  jobs,
  onPress,
}: {
  jobs: JobSettlement[];
  onPress: (job: JobSettlement) => void;
}) {
  return (
    <SectionCard
      title="PER-JOB SETTLEMENT"
      rightSlot={<Text className="text-caption text-ink-500">Tap to drill down</Text>}
    >
      {jobs.map((job) => (
        <JobRow key={job.id} job={job} onPress={onPress} />
      ))}
    </SectionCard>
  );
}
