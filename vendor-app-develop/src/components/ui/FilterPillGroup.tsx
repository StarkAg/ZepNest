import { ScrollView } from 'react-native';

import { FilterPill } from './FilterPill';

type FilterOption = { key: string; label: string };

type FilterPillGroupProps = {
  options: FilterOption[];
  selectedKey: string;
  onSelect: (key: string) => void;
};

export function FilterPillGroup({ options, selectedKey, onSelect }: FilterPillGroupProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, flexDirection: 'row' }}
    >
      {options.map((option) => (
        <FilterPill
          key={option.key}
          label={option.label}
          selected={selectedKey === option.key}
          onPress={() => onSelect(option.key)}
        />
      ))}
    </ScrollView>
  );
}
