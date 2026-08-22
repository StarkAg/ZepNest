import { ArrowLeftRight, LogOut } from 'lucide-react-native';
import { Modal, Pressable, Text, View } from 'react-native';

import { colors } from '@/src/theme/colors';
import { ROLE_SELECTION_COPY } from '@/src/types/auth';
import type { AuthRole } from '@/src/types/auth';

type ProfileMenuSheetProps = {
  visible: boolean;
  activeRole: AuthRole;
  /** Omit when the user only has a single role — hides the "Switch role" option. */
  otherRole?: AuthRole;
  onClose: () => void;
  onSwitchRole?: () => void;
  onLogout: () => void;
};

export function ProfileMenuSheet({
  visible,
  activeRole,
  otherRole,
  onClose,
  onSwitchRole,
  onLogout,
}: ProfileMenuSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <Pressable className="absolute inset-0" onPress={onClose} accessibilityRole="button" />

        <View className="gap-1 rounded-t-[20px] bg-white p-6">
          <View className="mb-4 h-1 w-10 self-center rounded-full bg-zn-border" />

          <Text
            className="text-micro font-bold uppercase text-ink-400"
            style={{ letterSpacing: 0.8 }}>
            Currently
          </Text>
          <Text className="mt-1 text-h3 font-extrabold text-ink-900">
            {ROLE_SELECTION_COPY[activeRole].title}
          </Text>

          {otherRole && onSwitchRole ? (
            <Pressable
              onPress={onSwitchRole}
              accessibilityRole="button"
              className="mt-5 flex-row items-center gap-3 rounded-2xl border border-zn-border p-4">
              <View className="h-11 w-11 items-center justify-center rounded-xl bg-brand-soft">
                <ArrowLeftRight size={20} color={colors.brand.accent} strokeWidth={2} />
              </View>
              <View className="flex-1">
                <Text className="text-body font-bold text-ink-900">Switch role</Text>
                <Text className="mt-0.5 text-caption text-ink-500">
                  {ROLE_SELECTION_COPY[otherRole].title}
                </Text>
              </View>
            </Pressable>
          ) : null}

          <Pressable
            onPress={onLogout}
            accessibilityRole="button"
            className="mt-5 flex-row items-center gap-3 rounded-2xl border border-zn-border p-4">
            <View className="h-11 w-11 items-center justify-center rounded-xl bg-red-50">
              <LogOut size={20} color={colors.status.offline.dot} strokeWidth={2} />
            </View>
            <Text className="text-body font-bold text-ink-900">Log out</Text>
          </Pressable>

          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            className="mt-3 h-12 items-center justify-center rounded-xl border border-zn-border">
            <Text className="text-body font-bold text-ink-900">Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
