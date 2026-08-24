import { CheckCircle } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { JOB_STATUS_CONFIG, STATUS_ORDER } from '@/src/components/jobs/jobConfig';
import { colors } from '@/src/theme/colors';
import type { StatusLogEntry } from '@/src/types/jobs';

type StatusLogProps = {
  entries: StatusLogEntry[];
};

export function StatusLog({ entries }: StatusLogProps) {
  const entryMap = new Map(entries.map((e) => [e.status, e]));

  return (
    <View className="mx-4 mt-4">
      <View className="flex-row items-center justify-between mb-2">
        <Text
          className="text-micro font-bold uppercase text-ink-500"
          style={{ letterSpacing: 0.8 }}
        >
          Status Log
        </Text>
        <Text className="text-caption font-medium" style={{ color: colors.brand.accent }}>
          ↺ Live
        </Text>
      </View>

      <View className="bg-surface-card rounded-[14px] border border-zn-border px-4 py-3">
        {STATUS_ORDER.map((status, index) => {
          const entry   = entryMap.get(status);
          const cfg     = JOB_STATUS_CONFIG[status];
          const StepIcon = cfg.Icon;

          const isCurrent = entry?.isCurrent ?? false;
          const isDone    = !!entry?.time && !isCurrent;
          const isPending = !entry?.time;

          const dotColor  = isDone || isCurrent ? cfg.dotColor : colors.ink[300];
          const dotBg     = isDone || isCurrent ? cfg.dotColor : 'transparent';
          const isLast    = index === STATUS_ORDER.length - 1;

          return (
            <View key={status} className="flex-row gap-3">
              <View className="items-center" style={{ width: 32 }}>
                <View
                  style={{
                    width: 32, height: 32, borderRadius: 16,
                    backgroundColor: isDone || isCurrent ? dotBg : 'transparent',
                    borderWidth: isPending ? 1.5 : 0,
                    borderColor: isPending ? colors.ink[200] : 'transparent',
                    alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {isDone ? (
                    <CheckCircle size={17} color="#FFFFFF" strokeWidth={2.5} fill={dotColor} />
                  ) : (
                    <StepIcon
                      size={15}
                      color={isPending ? colors.ink[300] : '#FFFFFF'}
                      strokeWidth={2}
                    />
                  )}
                </View>
                {!isLast && (
                  <View
                    className="w-px flex-1 my-[3px]"
                    style={{
                      backgroundColor: isDone ? cfg.dotColor : colors.ink[200],
                      minHeight: 16,
                    }}
                  />
                )}
              </View>

              <View className="flex-1 pb-3 justify-center" style={{ minHeight: 40 }}>
                <View className="flex-row items-center gap-2">
                  <Text
                    className="text-body-sm font-bold"
                    style={{ color: isPending ? colors.ink[400] : colors.ink[900] }}
                  >
                    {cfg.label}
                  </Text>
                  {isCurrent && (
                    <View
                      className="px-[6px] py-[2px] rounded-[4px]"
                      style={{ backgroundColor: colors.status.enRoute.bg }}
                    >
                      <Text
                        className="text-micro font-bold"
                        style={{ color: colors.status.enRoute.text, letterSpacing: 0.5 }}
                      >
                        NOW
                      </Text>
                    </View>
                  )}
                </View>
                <Text className="text-caption font-medium" style={{ color: colors.ink[500] }}>
                  {entry?.time ?? 'Pending'}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
