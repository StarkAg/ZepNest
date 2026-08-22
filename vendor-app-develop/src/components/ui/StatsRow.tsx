import { View } from 'react-native';

import type { DashboardStat } from '@/src/types/dashboard';

import { StatTile } from './StatTile';

type StatsRowProps = { stats: DashboardStat[] };

export function StatsRow({ stats }: StatsRowProps) {
  return (
    <View className="flex-row gap-2.5 px-4 py-3 bg-surface-app">
      {stats.map((stat) => (
        <StatTile key={stat.id} stat={stat} />
      ))}
    </View>
  );
}
