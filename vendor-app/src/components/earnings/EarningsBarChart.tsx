import { Text, View } from 'react-native';

import { colors } from '@/src/theme/colors';
import type { DayBar } from '@/src/types/earnings';

const BAR_AREA_HEIGHT = 72;
const BAR_BRAND = colors.brand.header;
const BAR_SOFT  = '#C8DFF9'; // blue-100 — no existing semantic token, pale bar fill only

function formatK(n: number) {
  return n >= 1000 ? `${Math.round(n / 1000)}k` : String(n);
}

function Bar({ bar, maxAmount }: { bar: DayBar; maxAmount: number }) {
  const ratio   = maxAmount > 0 ? bar.amount / maxAmount : 0;
  const barH    = Math.max(Math.round(ratio * BAR_AREA_HEIGHT), 6);
  const isToday = bar.isToday;

  return (
    <View className="flex-1 items-center">
      <Text
        className="text-[10px] mb-1"
        style={{ color: isToday ? BAR_BRAND : '#8C9AA0', fontWeight: isToday ? '700' : '500' }}
      >
        {formatK(bar.amount)}
      </Text>
      <View style={{ height: BAR_AREA_HEIGHT, justifyContent: 'flex-end', width: '100%', alignItems: 'center' }}>
        <View
          style={{
            width: '72%',
            height: barH,
            borderRadius: 4,
            backgroundColor: isToday ? BAR_BRAND : BAR_SOFT,
          }}
        />
      </View>
      <Text
        className="text-[10px] mt-1.5 font-semibold"
        style={{ color: isToday ? BAR_BRAND : '#687A81' }}
      >
        {bar.day}
      </Text>
    </View>
  );
}

export function EarningsBarChart({ bars }: { bars: DayBar[] }) {
  const maxAmount = Math.max(...bars.map((b) => b.amount));

  return (
    <View className="mx-4 mt-4">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-[11px] font-bold text-ink-500" style={{ letterSpacing: 0.7 }}>
          LAST 7 DAYS
        </Text>
        <Text className="text-caption text-ink-500 font-medium">Gross · ₹</Text>
      </View>
      <View className="bg-surface-card rounded-[14px] px-3 pt-4 pb-3">
        <View className="flex-row items-end gap-1">
          {bars.map((bar) => (
            <Bar key={bar.day} bar={bar} maxAmount={maxAmount} />
          ))}
        </View>
      </View>
    </View>
  );
}
