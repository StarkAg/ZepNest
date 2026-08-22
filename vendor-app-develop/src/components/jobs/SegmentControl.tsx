import { Pressable, Text, View } from 'react-native';

import { colors } from '@/src/theme/colors';
import type { JobPeriod } from '@/src/types/jobs';

const SEGMENTS: { key: JobPeriod; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'tomorrow', label: 'Tomorrow' },
  { key: 'thisWeek', label: 'This Week' },
];

type SegmentControlProps = {
  selected: JobPeriod;
  onSelect: (key: JobPeriod) => void;
};

export function SegmentControl({ selected, onSelect }: SegmentControlProps) {
  return (
    <View
      className="flex-row mx-4 mt-3 rounded-[14px]"
      style={{ backgroundColor: colors.surface.sunken, padding: 4 }}
    >
      {SEGMENTS.map(({ key, label }) => {
        const isSelected = key === selected;
        return (
          <Pressable
            key={key}
            onPress={() => onSelect(key)}
            className="flex-1 items-center justify-center"
            style={[
              { paddingVertical: 10, borderRadius: 11 },
              isSelected
                ? {
                    backgroundColor: colors.surface.card,
                    shadowColor: '#0e1a1f',
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    shadowOffset: { width: 0, height: 1 },
                    elevation: 2,
                  }
                : undefined,
            ]}
          >
            <Text
              className="text-body-sm"
              style={{
                fontWeight: isSelected ? '700' : '500',
                color: isSelected ? colors.ink[900] : colors.ink[500],
              }}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
