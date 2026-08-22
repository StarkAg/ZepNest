import { Text, View } from 'react-native';

import type { AvatarColor, StatusKey } from '@/src/theme';
import { colors } from '@/src/theme/colors';

type AvatarSize = 'sm' | 'md' | 'lg';
const DIAMETER: Record<AvatarSize, number> = { sm: 32, md: 44, lg: 48 };

type AvatarInitialsProps = {
  initials: string;
  avatarColor: AvatarColor;
  size?: AvatarSize;
  status?: StatusKey;
};

export function AvatarInitials({ initials, avatarColor, size = 'md', status }: AvatarInitialsProps) {
  const d = DIAMETER[size];
  const ringSize = d + 8;
  const fontSize = Math.round(d * 0.34);

  return (
    <View
      style={{
        width: ringSize,
        height: ringSize,
        borderRadius: ringSize / 2,
        borderWidth: status ? 2 : 0,
        borderColor: status ? colors.status[status].dot : 'transparent',
        backgroundColor: colors.surface.card,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          width: d,
          height: d,
          borderRadius: d / 2,
          backgroundColor: colors.avatar[avatarColor],
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: '#FFFFFF', fontWeight: '700', letterSpacing: 0.5, fontSize }}>
          {initials}
        </Text>
      </View>
    </View>
  );
}
