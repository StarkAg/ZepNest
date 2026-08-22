import { Text, View } from 'react-native';

import { formatRupees } from '@/lib/utils';
import { SectionCard } from '@/src/components/earnings/SectionCard';
import type { JobTypeData, JobTypeKey } from '@/src/types/earnings';
import { colors } from '@/src/theme/colors';

const DOT_COLORS: Record<JobTypeKey, string> = {
  rateCard:   colors.jobType.rateCard.dot,
  service:    colors.jobType.service.dot,
  highTicket: colors.jobType.highTicket.dot,
};

function JobTypeRow({ item }: { item: JobTypeData }) {
  return (
    <View className="flex-row items-center px-4 py-3 border-t border-zn-border gap-3">
      <View
        className="w-2.5 h-2.5 rounded-full"
        style={{ backgroundColor: DOT_COLORS[item.key] }}
      />
      <Text className="text-body-sm font-semibold text-ink-900 flex-1">{item.label}</Text>
      <Text className="text-body-sm text-ink-400 mr-4">{item.typeLabel}</Text>
      <Text className="text-body-sm font-medium text-ink-700 w-10 text-right">{item.percent}%</Text>
      <Text className="text-body-sm font-bold text-ink-900 w-20 text-right">
        {formatRupees(item.amount)}
      </Text>
    </View>
  );
}

export function JobTypeBreakdown({ items }: { items: JobTypeData[] }) {
  return (
    <SectionCard title="BY JOB TYPE">
      {items.map((item) => (
        <JobTypeRow key={item.key} item={item} />
      ))}
    </SectionCard>
  );
}
