import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cn } from '@/lib/utils';
import { colors } from '@/src/theme/colors';
import type { DashboardTab } from '@/src/types/dashboard';

type BottomNavProps = {
  tabs: DashboardTab[];
  activeKey: string;
  onTabChange: (key: string) => void;
};

export function BottomNav({ tabs, activeKey, onTabChange }: BottomNavProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-row bg-surface-card border-t border-zn-border pt-2"
      style={{ paddingBottom: insets.bottom + 8 }}
    >
      {tabs.map((tab) => {
        const isActive = tab.key === activeKey;
        const { Icon } = tab;
        const iconColor = isActive ? colors.tab.active : colors.tab.inactive;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onTabChange(tab.key)}
            className="flex-1 items-center justify-center min-h-[48px] gap-[3px]"
          >
            <View className="relative items-center justify-center">
              <Icon size={24} color={iconColor} strokeWidth={isActive ? 2.25 : 1.75} />
              {tab.badge !== undefined && (
                <View
                  className="absolute top-[-4px] right-[-8px] rounded-[999px] min-w-[16px] h-[16px] items-center justify-center px-[3px] border-[1.5px] border-surface-card"
                  style={{ backgroundColor: colors.status.offline.dot }}
                >
                  <Text className="text-[9px] font-bold text-white">{tab.badge}</Text>
                </View>
              )}
            </View>
            <Text
              className={cn(
                'text-micro',
                isActive ? 'text-tab-active font-semibold' : 'text-tab-inactive font-medium'
              )}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
