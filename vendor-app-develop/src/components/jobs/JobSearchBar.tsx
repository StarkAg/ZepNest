import { Search } from 'lucide-react-native';
import { TextInput, View } from 'react-native';

import { colors } from '@/src/theme/colors';

type JobSearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
};

export function JobSearchBar({ value, onChangeText }: JobSearchBarProps) {
  return (
    <View
      className="flex-row items-center gap-2 mx-4 mt-3 px-3 h-10 rounded-[10px] border border-zn-border bg-surface-card"
    >
      <Search size={16} color={colors.ink[400]} strokeWidth={2} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search job ID, address or technician"
        placeholderTextColor={colors.ink[400]}
        className="flex-1 text-body-sm text-ink-900"
        style={{ paddingVertical: 0 }}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
      />
    </View>
  );
}
