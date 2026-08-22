import { ChevronLeft, MoreVertical, Phone } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/src/theme/colors';

type DetailHeaderProps = {
  vendorName: string;
  onBack: () => void;
  onCall: () => void;
  onMore: () => void;
};

export function DetailHeader({ vendorName, onBack, onCall, onMore }: DetailHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-row items-center bg-surface-card border-b border-zn-border px-1"
      style={{ paddingTop: insets.top + 4, paddingBottom: 8, minHeight: 56 }}
    >
      <Pressable
        onPress={onBack}
        className="min-w-[48px] min-h-[48px] items-center justify-center"
      >
        <ChevronLeft size={24} color={colors.ink[900]} strokeWidth={2} />
      </Pressable>

      <View className="flex-1 min-w-0">
        <Text className="text-title font-bold text-ink-900" style={{ letterSpacing: -0.2 }}>
          Technician detail
        </Text>
        <Text className="text-caption font-medium text-ink-500 mt-[1px]">
          {vendorName} · My Team
        </Text>
      </View>

      <Pressable
        onPress={onCall}
        className="min-w-[48px] min-h-[48px] items-center justify-center"
      >
        <Phone size={20} color={colors.ink[900]} strokeWidth={2} />
      </Pressable>

      <Pressable
        onPress={onMore}
        className="min-w-[48px] min-h-[48px] items-center justify-center"
      >
        <MoreVertical size={20} color={colors.ink[900]} strokeWidth={2} />
      </Pressable>
    </View>
  );
}
