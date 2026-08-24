import { Pressable, Text } from 'react-native';

import { cn } from '@/lib/utils';

type FilterPillProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function FilterPill({ label, selected, onPress }: FilterPillProps) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'h-8 px-3.5 rounded-[999px] border items-center justify-center mr-2',
        selected
          ? 'bg-pill-selectedBg border-pill-selectedBg'
          : 'bg-pill-defaultBg border-pill-defaultBorder'
      )}
    >
      <Text
        className={cn(
          'text-body-sm',
          selected
            ? 'text-pill-selectedText font-semibold'
            : 'text-pill-defaultText font-medium'
        )}
      >
        {label}
      </Text>
    </Pressable>
  );
}
