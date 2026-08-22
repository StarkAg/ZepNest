import { WifiOff } from 'lucide-react-native';
import { Modal, Pressable, Text, View } from 'react-native';

import { colors } from '@/src/theme/colors';

type GoOfflineSheetProps = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function GoOfflineSheet({ visible, onCancel, onConfirm }: GoOfflineSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View className="flex-1 justify-end bg-black/40">
        <Pressable className="absolute inset-0" onPress={onCancel} accessibilityRole="button" />

        <View className="gap-1 rounded-t-[20px] bg-white p-6">
          <View className="mb-4 h-1 w-10 self-center rounded-full bg-zn-border" />

          <View
            className="h-12 w-12 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.status.offline.bg }}>
            <WifiOff size={22} color={colors.status.offline.dot} strokeWidth={2} />
          </View>

          <Text className="mt-4 text-h2 font-extrabold text-ink-900">Go offline?</Text>
          <Text className="mt-2 text-body text-ink-500">
            Going offline will pause new job assignments. You won&apos;t appear on the Vendor map
            until you go back online. You can re-enable this any time.
          </Text>

          <View className="mt-6 flex-row gap-3">
            <Pressable
              onPress={onCancel}
              accessibilityRole="button"
              className="h-12 flex-1 items-center justify-center rounded-xl border border-zn-border">
              <Text className="text-body font-bold text-ink-900">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              accessibilityRole="button"
              className="h-12 flex-1 items-center justify-center rounded-xl"
              style={{ backgroundColor: colors.status.offline.dot }}>
              <Text className="text-body font-bold text-white">Go offline</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
