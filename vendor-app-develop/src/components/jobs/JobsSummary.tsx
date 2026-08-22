import { Text, View } from 'react-native';

import { colors } from '@/src/theme/colors';

type SummaryTileProps = {
  label: string;
  count: number;
  dotColor: string;
};

function SummaryTile({ label, count, dotColor }: SummaryTileProps) {
  return (
    <View className="flex-1 bg-surface-card rounded-[12px] border border-zn-border px-3 py-2.5 gap-1">
      <View className="flex-row items-center gap-1.5">
        <View className="w-[7px] h-[7px] rounded-[999px]" style={{ backgroundColor: dotColor }} />
        <Text
          className="text-micro font-bold uppercase text-ink-500"
          style={{ letterSpacing: 0.7 }}
        >
          {label}
        </Text>
      </View>
      <Text className="text-num-md font-extrabold text-ink-900">{count}</Text>
    </View>
  );
}

type JobsSummaryProps = {
  activeNow: number;
  scheduled: number;
  completed: number;
};

export function JobsSummary({ activeNow, scheduled, completed }: JobsSummaryProps) {
  return (
    <View className="flex-row gap-2 mx-4 mt-3">
      <SummaryTile label="Active now" count={activeNow} dotColor={colors.status.onJob.dot} />
      <SummaryTile label="Scheduled" count={scheduled} dotColor={colors.ink[400]} />
      <SummaryTile label="Completed" count={completed} dotColor={colors.status.available.dot} />
    </View>
  );
}
