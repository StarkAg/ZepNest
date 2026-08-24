import { Briefcase, ChevronRight, Wrench } from 'lucide-react-native';
import type { ComponentType } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/src/theme/colors';
import { ROLE_SELECTION_COPY } from '@/src/types/auth';
import type { AuthRole } from '@/src/types/auth';

type RoleSelectScreenProps = {
  onSelectRole: (role: AuthRole) => void;
};

export function RoleSelectScreen({ onSelectRole }: RoleSelectScreenProps) {
  return (
    <View className="flex-1 bg-brand-header">
      <SafeAreaView className="flex-1">
        <View className="items-center pb-10 pt-8">
          <View className="h-14 w-14 items-center justify-center rounded-2xl border-2 border-white/40 bg-white/10">
            <Text className="text-h1 font-bold text-white">Z</Text>
          </View>
          <Text className="mt-3 text-h1 font-bold text-white">ZepNest Partner App</Text>
        </View>

        <View className="flex-1 rounded-t-[28px] bg-white px-6 pb-6 pt-8">
          <Text className="text-h1 font-extrabold text-ink-900">How are you working today?</Text>
          <Text className="mt-2 text-body text-ink-500">
            Your account is set up for both roles. Pick one to continue — you can switch anytime
            from your profile.
          </Text>

          <View className="mt-8 gap-3">
            <RoleOptionCard
              Icon={Briefcase}
              title={ROLE_SELECTION_COPY.vendor.title}
              description={ROLE_SELECTION_COPY.vendor.description}
              onPress={() => onSelectRole('vendor')}
            />
            <RoleOptionCard
              Icon={Wrench}
              title={ROLE_SELECTION_COPY.technician.title}
              description={ROLE_SELECTION_COPY.technician.description}
              onPress={() => onSelectRole('technician')}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

type IconComponent = ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;

type RoleOptionCardProps = {
  Icon: IconComponent;
  title: string;
  description: string;
  onPress: () => void;
};

function RoleOptionCard({ Icon, title, description, onPress }: RoleOptionCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className="flex-row items-center gap-3 rounded-2xl border border-zn-border p-4">
      <View className="h-11 w-11 items-center justify-center rounded-xl bg-brand-soft">
        <Icon size={20} color={colors.brand.accent} strokeWidth={2} />
      </View>
      <View className="flex-1">
        <Text className="text-body font-bold text-ink-900">{title}</Text>
        <Text className="mt-0.5 text-caption text-ink-500">{description}</Text>
      </View>
      <ChevronRight size={18} color={colors.ink[400]} />
    </Pressable>
  );
}
