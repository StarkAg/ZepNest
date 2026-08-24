import { Bell, User } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/src/theme/colors';

type AppHeaderProps = {
  title: string;
  subtitle?: string;
  notificationCount?: number;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
};

export function AppHeader({
  title,
  subtitle,
  notificationCount = 0,
  onNotificationPress,
  onProfilePress,
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-row items-center justify-between bg-surface-card border-b border-zn-border pb-3 px-4"
      style={{ paddingTop: insets.top + 8, minHeight: 56 }}
    >
      <View className="flex-1 min-w-0">
        <Text
          className="text-[20px] font-extrabold text-ink-900"
          style={{ letterSpacing: -0.25, lineHeight: 23 }}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text className="text-caption font-medium text-ink-500 mt-[1px]">{subtitle}</Text>
        ) : null}
      </View>

      <View className="flex-row items-center">
        <Pressable
          onPress={onNotificationPress}
          className="min-w-[48px] min-h-[48px] items-center justify-center"
        >
          <Bell size={22} color="#0E1A1F" />
          {notificationCount > 0 && (
            <View
              className="absolute top-[6px] right-[4px] rounded-[999px] min-w-[16px] h-[16px] items-center justify-center px-[3px] border-[1.5px] border-surface-card"
              style={{ backgroundColor: colors.status.onJob.dot }}
            >
              <Text className="text-[9px] font-bold text-white">{notificationCount}</Text>
            </View>
          )}
        </Pressable>

        <Pressable
          onPress={onProfilePress}
          className="min-w-[48px] min-h-[48px] items-center justify-center"
        >
          <User size={22} color="#0E1A1F" />
        </Pressable>
      </View>
    </View>
  );
}
