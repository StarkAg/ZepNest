import { Bell } from 'lucide-react-native';
import { Pressable, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AvatarInitials } from '@/src/components/ui/AvatarInitials';
import { colors } from '@/src/theme/colors';
import type { AvatarColor } from '@/src/theme';

type TechnicianHomeHeaderProps = {
  name: string;
  initials: string;
  avatarColor: AvatarColor;
  isOnline: boolean;
  isUpdatingOnlineStatus: boolean;
  notificationCount?: number;
  onToggleOnline: (value: boolean) => void;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
};

export function TechnicianHomeHeader({
  name,
  initials,
  avatarColor,
  isOnline,
  isUpdatingOnlineStatus,
  notificationCount = 0,
  onToggleOnline,
  onNotificationPress,
  onProfilePress,
}: TechnicianHomeHeaderProps) {
  const insets = useSafeAreaInsets();
  const statusKey = isOnline ? 'available' : 'offline';

  return (
    <View
      className="flex-row items-center justify-between border-b border-zn-border bg-surface-card px-4 pb-3"
      style={{ paddingTop: insets.top + 8, minHeight: 56 }}>
      <View className="min-w-0 flex-1 flex-row items-center gap-3">
        <Pressable onPress={onProfilePress} accessibilityRole="button">
          <AvatarInitials
            initials={initials}
            avatarColor={avatarColor}
            size="md"
            status={statusKey}
          />
        </Pressable>
        <View className="min-w-0">
          <Text className="text-title font-bold text-ink-900" numberOfLines={1}>
            {name}
          </Text>
          <Text
            className="text-caption font-semibold"
            style={{ color: colors.status[statusKey].text }}>
            {isOnline ? 'Online' : 'Offline'}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-2">
        <Switch
          value={isOnline}
          onValueChange={onToggleOnline}
          disabled={isUpdatingOnlineStatus}
          trackColor={{ false: colors.ink[200], true: colors.status.available.dot }}
          thumbColor={colors.white}
        />
        <Pressable
          onPress={onNotificationPress}
          className="min-h-[44px] min-w-[44px] items-center justify-center">
          <Bell size={22} color={colors.ink[900]} />
          {notificationCount > 0 && (
            <View
              className="absolute right-[8px] top-[8px] h-[10px] w-[10px] rounded-[999px] border-[1.5px] border-surface-card"
              style={{ backgroundColor: colors.status.offline.dot }}
            />
          )}
        </Pressable>
      </View>
    </View>
  );
}
