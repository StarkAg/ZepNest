import { IndianRupee, Percent, RotateCcw, ShieldCheck, TrendingUp } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { formatRupees } from '@/lib/utils';
import { SectionCard } from '@/src/components/earnings/SectionCard';
import type { BreakdownIconKey, BreakdownItem } from '@/src/types/earnings';
import { colors } from '@/src/theme/colors';

function BreakdownIcon({ icon }: { icon: BreakdownIconKey }) {
  const size = 16;
  const color = colors.ink[500];
  switch (icon) {
    case 'rupee':    return <IndianRupee size={size} color={color} />;
    case 'percent':  return <Percent size={size} color={color} />;
    case 'trending': return <TrendingUp size={size} color={color} />;
    case 'refresh':  return <RotateCcw size={size} color={color} />;
  }
}

function amountColor(variant: BreakdownItem['variant']) {
  if (variant === 'deduction') return colors.status.offline.dot;
  if (variant === 'addition')  return colors.money.positive;
  return colors.ink[900];
}

function amountLabel(variant: BreakdownItem['variant'], amount: number) {
  if (amount === 0)             return `–${formatRupees(0)}`;
  if (variant === 'deduction')  return `–${formatRupees(Math.abs(amount))}`;
  if (variant === 'addition')   return `+${formatRupees(amount)}`;
  return formatRupees(amount);
}

function BreakdownRow({ item }: { item: BreakdownItem }) {
  return (
    <View className="flex-row items-center px-4 py-3 border-t border-zn-border gap-3">
      <View className="w-8 h-8 rounded-full bg-surface-app items-center justify-center">
        <BreakdownIcon icon={item.icon} />
      </View>
      <View className="flex-1">
        <Text className="text-body-sm font-semibold text-ink-900">{item.label}</Text>
        <Text className="text-caption text-ink-500 mt-0.5">{item.sublabel}</Text>
      </View>
      <Text
        className="text-title font-bold"
        style={{ color: amountColor(item.variant) }}
      >
        {amountLabel(item.variant, item.amount)}
      </Text>
    </View>
  );
}

export function SettlementBreakdown({ items }: { items: BreakdownItem[] }) {
  return (
    <SectionCard
      title="SETTLEMENT BREAKDOWN"
      rightSlot={
        <View className="flex-row items-center gap-1">
          <ShieldCheck size={13} color={colors.money.positive} />
          <Text className="text-caption font-medium" style={{ color: colors.money.positive }}>
            Matches statement
          </Text>
        </View>
      }
    >
      {items.map((item) => (
        <BreakdownRow key={item.id} item={item} />
      ))}
    </SectionCard>
  );
}
