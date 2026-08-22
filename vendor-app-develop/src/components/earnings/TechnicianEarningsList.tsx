import { ChevronRight } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { formatRupees } from '@/lib/utils';
import { AvatarInitials } from '@/src/components/ui/AvatarInitials';
import { SectionCard } from '@/src/components/earnings/SectionCard';
import type { TechnicianEarning } from '@/src/types/earnings';
import { colors } from '@/src/theme/colors';

function ProgressBar({ percent }: { percent: number }) {
  return (
    <View className="h-1.5 rounded-full mt-1.5 mb-1 overflow-hidden" style={{ backgroundColor: colors.ink[100], maxWidth: 120 }}>
      <View
        className="h-full rounded-full"
        style={{ width: `${percent}%`, backgroundColor: colors.brand.header }}
      />
    </View>
  );
}

function TechnicianRow({
  item,
  onPress,
}: {
  item: TechnicianEarning;
  onPress: (item: TechnicianEarning) => void;
}) {
  return (
    <Pressable
      onPress={() => onPress(item)}
      className="flex-row items-center px-4 py-3 border-t border-zn-border gap-3 active:opacity-70"
    >
      <AvatarInitials initials={item.initials} avatarColor={item.avatarColor} size="sm" />
      <View className="flex-1">
        <Text className="text-body-sm font-semibold text-ink-900">{item.name}</Text>
        <ProgressBar percent={item.percent} />
        <Text className="text-caption text-ink-500">
          {item.jobsDone} jobs · {item.percent}%
        </Text>
      </View>
      <View className="items-end">
        <Text className="text-body-sm font-bold text-ink-900">{formatRupees(item.grossAmount)}</Text>
        <Text className="text-caption text-ink-500">gross</Text>
      </View>
      <ChevronRight size={16} color={colors.ink[300]} />
    </Pressable>
  );
}

export function TechnicianEarningsList({
  items,
  onPress,
}: {
  items: TechnicianEarning[];
  onPress: (item: TechnicianEarning) => void;
}) {
  return (
    <SectionCard
      title="PER-TECHNICIAN EARNINGS"
      rightSlot={<Text className="text-caption text-ink-500">{items.length} technicians</Text>}
    >
      {items.map((item) => (
        <TechnicianRow key={item.id} item={item} onPress={onPress} />
      ))}
    </SectionCard>
  );
}
