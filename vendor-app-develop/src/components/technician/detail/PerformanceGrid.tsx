import { CheckCircle, Clock, Flag, Star, TrendingUp } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { colors } from '@/src/theme/colors';

type PerformanceGridProps = {
  rating: number;
  ratingDelta: number;
  acceptance: number;
  onTimeArrival: number;
  jobsDone: number;
};

type MetricTileProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: React.ReactNode;
};

function MetricTile({ icon, label, value, sub }: MetricTileProps) {
  return (
    <View className="flex-1 bg-surface-card rounded-[14px] border border-zn-border p-3 gap-[2px]">
      <View className="flex-row items-center gap-1.5 mb-1">
        {icon}
        <Text className="text-caption text-ink-500 font-medium">{label}</Text>
      </View>
      <Text className="text-num-md font-extrabold text-ink-900">{value}</Text>
      {sub ? <View className="mt-[2px]">{sub}</View> : null}
    </View>
  );
}

export function PerformanceGrid({
  rating,
  ratingDelta,
  acceptance,
  onTimeArrival,
  jobsDone,
}: PerformanceGridProps) {
  return (
    <View className="mx-4 mt-4 gap-2">
      <View className="flex-row items-center justify-between">
        <Text className="text-micro font-bold uppercase text-ink-500" style={{ letterSpacing: 0.8 }}>
          Performance
        </Text>
        <Text className="text-caption text-ink-400">Last 30 days</Text>
      </View>
      <View className="gap-2">
        <View className="flex-row gap-2">
          <MetricTile
            icon={<Star size={14} color="#E8920C" strokeWidth={2} fill="#E8920C" />}
            label="Avg rating"
            value={rating.toFixed(1)}
            sub={
              <View className="flex-row items-center gap-[3px]">
                <TrendingUp size={11} color={colors.money.positive} strokeWidth={2.5} />
                <Text className="text-micro font-semibold" style={{ color: colors.money.positive }}>
                  +{ratingDelta.toFixed(1)}
                </Text>
              </View>
            }
          />
          <MetricTile
            icon={<CheckCircle size={14} color={colors.status.available.dot} strokeWidth={2} />}
            label="Acceptance"
            value={`${acceptance}%`}
          />
        </View>
        <View className="flex-row gap-2">
          <MetricTile
            icon={<Clock size={14} color={colors.status.onJob.dot} strokeWidth={2} />}
            label="On-time arrival"
            value={`${onTimeArrival}%`}
          />
          <MetricTile
            icon={<Flag size={14} color={colors.ink[700]} strokeWidth={2} />}
            label="Jobs done"
            value={`${jobsDone}`}
          />
        </View>
      </View>
    </View>
  );
}
