import { useRef } from 'react';
import { TextInput, View } from 'react-native';

import { cn } from '@/lib/utils';

type OtpInputProps = {
  length?: number;
  value: string[];
  onChange: (value: string[]) => void;
};

export function OtpInput({ length = 6, value, onChange }: OtpInputProps) {
  const inputRefs = useRef<(TextInput | null)[]>([]);

  function handleChangeText(text: string, index: number) {
    const digit = text.slice(-1).replace(/[^0-9]/g, '');
    const next = [...value];
    next[index] = digit;
    onChange(next);

    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyPress(key: string, index: number) {
    if (key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  return (
    <View className="flex-row gap-2">
      {Array.from({ length }).map((_, index) => {
        const digit = value[index] ?? '';
        const isFilled = digit !== '';
        const isFocusTarget = !isFilled && (index === 0 || value[index - 1] !== '');

        return (
          <TextInput
            key={index}
            ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
            value={digit}
            onChangeText={(text) => handleChangeText(text, index)}
            onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
            keyboardType="number-pad"
            maxLength={1}
            className={cn(
              'h-12 w-12 rounded-lg border text-center text-h3 font-semibold text-ink-900',
              isFilled
                ? 'border-brand-header bg-brand-soft'
                : isFocusTarget
                  ? 'border-brand-header bg-white'
                  : 'border-zn-border bg-white'
            )}
          />
        );
      })}
    </View>
  );
}
