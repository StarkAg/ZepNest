import { useState } from 'react';
import { Calendar, Check, X } from 'lucide-react-native';
import { Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/src/theme/colors';

interface DateRange {
  from: string;
  to: string;
  presetKey: string | null;
}

const QUICK_PRESETS = [
  { key: 'last7',  label: 'Last 7 days'  },
  { key: 'last14', label: 'Last 14 days' },
  { key: 'last30', label: 'Last 30 days' },
  { key: 'jun',    label: '1 – 12 Jun'   },
  { key: 'may',    label: 'May 2026'     },
  { key: 'apr',    label: 'Apr 2026'     },
];

const PRESET_DATES: Record<string, { from: string; to: string }> = {
  last7:  { from: '09 Jun 2026', to: '15 Jun 2026' },
  last14: { from: '02 Jun 2026', to: '15 Jun 2026' },
  last30: { from: '16 May 2026', to: '15 Jun 2026' },
  jun:    { from: '01 Jun 2026', to: '12 Jun 2026' },
  may:    { from: '01 May 2026', to: '31 May 2026' },
  apr:    { from: '01 Apr 2026', to: '30 Apr 2026' },
};

function DateInput({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1">
      <Text className="text-[11px] font-bold text-ink-500 mb-1.5" style={{ letterSpacing: 0.7 }}>
        {label}
      </Text>
      <View
        className="flex-row items-center gap-2 px-3 rounded-[10px] border"
        style={{ borderColor: colors.border.default, height: 44 }}
      >
        <Calendar size={16} color={colors.ink[500]} />
        <Text className="text-body-sm font-medium text-ink-900">{value}</Text>
      </View>
    </View>
  );
}

export function CustomDateSheet({
  visible,
  onClose,
  onApply,
}: {
  visible: boolean;
  onClose: () => void;
  onApply: (range: DateRange) => void;
}) {
  const insets = useSafeAreaInsets();
  const [range, setRange] = useState<DateRange>({ ...PRESET_DATES.jun, presetKey: 'jun' });

  function selectPreset(key: string) {
    setRange({ ...PRESET_DATES[key], presetKey: key });
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1" style={{ backgroundColor: 'rgba(14,26,31,0.55)' }}>
        <Pressable className="flex-1" onPress={onClose} />
        <View
          className="bg-surface-card rounded-t-[20px] px-4 pt-3"
          style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}
        >
          <View className="w-10 h-1 rounded-full bg-ink-200 self-center mb-4" />

          <View className="flex-row items-center justify-between mb-5">
            <Text className="text-h3 font-semibold text-ink-900">Custom date range</Text>
            <Pressable
              onPress={onClose}
              className="w-8 h-8 rounded-full bg-surface-app items-center justify-center"
            >
              <X size={16} color={colors.ink[700]} />
            </Pressable>
          </View>

          <View className="flex-row gap-3 mb-5">
            <DateInput label="FROM" value={range.from} />
            <DateInput label="TO"   value={range.to}   />
          </View>

          <Text className="text-[11px] font-bold text-ink-500 mb-2.5" style={{ letterSpacing: 0.7 }}>
            QUICK PRESETS
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-5">
            {QUICK_PRESETS.map((preset) => {
              const active = range.presetKey === preset.key;
              return (
                <Pressable
                  key={preset.key}
                  onPress={() => selectPreset(preset.key)}
                  className="rounded-full px-4 py-2 border"
                  style={{
                    backgroundColor: active ? colors.brand.header : colors.surface.card,
                    borderColor:     active ? colors.brand.header : colors.border.default,
                  }}
                >
                  <Text
                    className="text-body-sm font-semibold"
                    style={{ color: active ? '#fff' : colors.ink[700] }}
                  >
                    {preset.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Pressable
            onPress={() => { onApply(range); onClose(); }}
            className="flex-row items-center justify-center gap-2 rounded-[12px]"
            style={{ backgroundColor: colors.brand.header, height: 52 }}
          >
            <Check size={18} color="#fff" />
            <Text className="text-title font-bold text-white">Apply range</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
