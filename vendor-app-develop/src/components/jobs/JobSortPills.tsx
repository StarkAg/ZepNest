import { Clock, IndianRupee, User, CircleDot } from 'lucide-react-native';
import type { ComponentType } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { colors } from '@/src/theme/colors';
import type { JobSortKey } from '@/src/types/jobs';

type IconProps = { size?: number; color?: string; strokeWidth?: number };

const SORT_OPTIONS: { key: JobSortKey; label: string; Icon: ComponentType<IconProps> }[] = [
  { key: 'time',       label: 'Time',       Icon: Clock },
  { key: 'status',     label: 'Status',     Icon: CircleDot },
  { key: 'technician', label: 'Technician', Icon: User },
  { key: 'amount',     label: 'Amount',      Icon: IndianRupee },
];

type JobSortPillsProps = {
  selected: JobSortKey;
  onSelect: (key: JobSortKey) => void;
};

export function JobSortPills({ selected, onSelect }: JobSortPillsProps) {
  return (
    <View className="flex-row items-center mt-3">
      <Text className="text-caption font-semibold text-ink-500 mr-2" style={{ marginLeft: 20 }}>
        Sort
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingLeft: 4, paddingRight: 20 }}
      >
        {SORT_OPTIONS.map(({ key, label, Icon }) => {
          const isSelected = key === selected;
          return (
            <Pressable
              key={key}
              onPress={() => onSelect(key)}
              className="flex-row items-center gap-1.5 h-8 px-3 rounded-[999px] border"
              style={{
                borderColor: isSelected ? colors.brand.accent : colors.border.default,
                backgroundColor: isSelected ? colors.brand.soft : colors.surface.card,
                marginRight: 8,
              }}
            >
              <Icon
                size={13}
                color={isSelected ? colors.brand.accent : colors.ink[500]}
                strokeWidth={2}
              />
              <Text
                className="text-label"
                style={{
                  fontWeight: isSelected ? '600' : '500',
                  color: isSelected ? colors.brand.accent : colors.ink[700],
                }}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
