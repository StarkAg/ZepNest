import { Text, View } from 'react-native';

import { formatRupees } from '@/lib/utils';
import type { TodaysEarnings } from '@/src/types/job';

type EarningsCardProps = {
  earnings: TodaysEarnings;
};

export function EarningsCard({ earnings }: EarningsCardProps) {
  return (
    <View className="mx-4 mt-3 rounded-[14px] border border-zn-border bg-surface-card p-4">
      <Text className="text-micro font-bold uppercase text-ink-500" style={{ letterSpacing: 0.8 }}>
        Today&apos;s Earnings
      </Text>
      <Text className="mt-1 text-display font-extrabold text-ink-900">
        {formatRupees(earnings.amount)}
      </Text>
      <Text
        className="mt-1 text-micro font-bold uppercase text-ink-400"
        style={{ letterSpacing: 0.8 }}>
        {earnings.jobsDone}/{earnings.jobsTotal} JOBS DONE
      </Text>
    </View>
  );
}
