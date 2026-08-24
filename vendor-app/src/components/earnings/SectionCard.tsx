import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

export function SectionCard({
  title,
  rightSlot,
  children,
}: {
  title: string;
  rightSlot?: ReactNode;
  children: ReactNode;
}) {
  return (
    <View className="mx-4 mt-3 bg-surface-card rounded-[14px] overflow-hidden">
      <View className="flex-row items-center justify-between px-4 pt-4 pb-3">
        <Text className="text-[11px] font-bold text-ink-500" style={{ letterSpacing: 0.7 }}>
          {title}
        </Text>
        {rightSlot}
      </View>
      {children}
    </View>
  );
}
