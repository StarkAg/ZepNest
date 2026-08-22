import { Text, View } from 'react-native';

import { formatRupees } from '@/lib/utils';

type EarningsSummaryProps = {
  weeklyEarnings: number;
  monthlyEarnings: number;
};

function EarningColumn({ label, amount }: { label: string; amount: number }) {
  return (
    <View className="flex-1 gap-[3px]">
      <Text className="text-micro font-bold uppercase text-ink-500" style={{ letterSpacing: 0.8 }}>
        {label}
      </Text>
      <Text className="text-num-md font-extrabold text-money-positive">
        {formatRupees(amount)}
      </Text>
    </View>
  );
}

export function EarningsSummary({ weeklyEarnings, monthlyEarnings }: EarningsSummaryProps) {
  return (
    <View className="mx-4 mt-4 gap-2">
      <View className="flex-row items-center justify-between">
        <Text className="text-micro font-bold uppercase text-ink-500" style={{ letterSpacing: 0.8 }}>
          Earnings
        </Text>
        <Text className="text-caption text-ink-400">Visible to vendor</Text>
      </View>
      <View className="bg-surface-card rounded-[14px] border border-zn-border p-4 flex-row">
        <EarningColumn label="This week" amount={weeklyEarnings} />
        <View className="w-px bg-zn-border mx-4" />
        <EarningColumn label="This month" amount={monthlyEarnings} />
      </View>
    </View>
  );
}
