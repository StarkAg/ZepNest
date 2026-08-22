import { Expand, MapPin } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/src/theme/colors';
import type { AvatarColor } from '@/src/theme/colors';

type LiveLocationMapProps = {
  initials: string;
  avatarColor: AvatarColor;
  address: string;
  updatedAgo: string;
  onExpand?: () => void;
};

export function LiveLocationMap({
  initials,
  avatarColor,
  address,
  updatedAgo,
  onExpand,
}: LiveLocationMapProps) {
  return (
    <View className="mx-4 mt-4 gap-2">
      <View className="flex-row items-center justify-between">
        <Text className="text-micro font-bold uppercase text-ink-500" style={{ letterSpacing: 0.8 }}>
          Live Location
        </Text>
        <Text className="text-caption text-ink-400">Working hours only</Text>
      </View>

      <View className="rounded-[14px] border border-zn-border overflow-hidden">
        <View
          className="h-[160px] items-center justify-center"
          style={{ backgroundColor: '#E8EFF2' }}
        >
          {/* Map grid lines placeholder */}
          <View className="absolute inset-0 opacity-30">
            {[0, 1, 2, 3].map((i) => (
              <View
                key={`h${i}`}
                className="absolute w-full border-t border-zn-border"
                style={{ top: `${(i + 1) * 25}%` }}
              />
            ))}
            {[0, 1, 2, 3].map((i) => (
              <View
                key={`v${i}`}
                className="absolute h-full border-l border-zn-border"
                style={{ left: `${(i + 1) * 25}%` }}
              />
            ))}
          </View>

          {/* Live indicator */}
          <View
            className="absolute top-3 left-3 flex-row items-center gap-1.5 px-2.5 py-[5px] rounded-[999px]"
            style={{ backgroundColor: colors.surface.card }}
          >
            <View
              className="w-[7px] h-[7px] rounded-[999px]"
              style={{ backgroundColor: colors.status.available.dot }}
            />
            <Text className="text-caption font-semibold text-ink-700">
              Live · {updatedAgo}
            </Text>
          </View>

          {/* Expand button */}
          <Pressable
            onPress={onExpand}
            className="absolute top-3 right-3 w-8 h-8 rounded-[8px] items-center justify-center"
            style={{ backgroundColor: colors.surface.card }}
          >
            <Expand size={15} color={colors.ink[700]} strokeWidth={2} />
          </Pressable>

          {/* Technician pin */}
          <View
            className="w-11 h-11 rounded-[999px] items-center justify-center border-[3px]"
            style={{ borderColor: colors.brand.accent, backgroundColor: colors.avatar[avatarColor] }}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 15, letterSpacing: 0.5 }}>
              {initials}
            </Text>
          </View>
        </View>

        {/* Address bar */}
        <View
          className="flex-row items-center gap-2 px-3 py-2.5 border-t border-zn-border"
          style={{ backgroundColor: colors.surface.card }}
        >
          <MapPin size={14} color={colors.ink[500]} strokeWidth={2} />
          <Text className="text-body-sm font-medium text-ink-700 flex-1" numberOfLines={1}>
            {address}
          </Text>
        </View>
      </View>
    </View>
  );
}
