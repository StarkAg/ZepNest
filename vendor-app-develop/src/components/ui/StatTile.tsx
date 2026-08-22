import { Text, View } from 'react-native';

import { colors } from '@/src/theme/colors';
import type { DashboardStat } from '@/src/types/dashboard';

const STAT_ICON_COLOR: Record<string, string> = {
  online: colors.stat.online,
  onJob:  colors.stat.onJob,
  done:   colors.stat.done,
};

type StatTileProps = { stat: DashboardStat };

export function StatTile({ stat }: StatTileProps) {
  const { Icon, label, value, colorKey } = stat;

  return (
    <View
      className="flex-1 bg-surface-card border border-zn-border rounded-[14px] p-3 elevation-1"
      style={{ shadowColor: '#0e1a1f', shadowOpacity: 0.06, shadowRadius: 2 }}
    >
      <Icon size={18} color={STAT_ICON_COLOR[colorKey]} strokeWidth={2.25} />
      <Text className="text-num-md font-extrabold text-ink-900 mt-1.5">{value}</Text>
      <Text
        className="text-micro font-bold uppercase text-ink-500 mt-0.5"
        style={{ letterSpacing: 1 }}
      >
        {label}
      </Text>
    </View>
  );
}
