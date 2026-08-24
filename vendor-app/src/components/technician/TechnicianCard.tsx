import { ArrowRight, Key } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { cn } from '@/lib/utils';
import type { Technician } from '@/src/types/technician';

import { AvatarInitials } from '../ui/AvatarInitials';
import { StatusBadge } from '../ui/StatusBadge';

type TechnicianCardProps = {
  technician: Technician;
  onPress: (technician: Technician) => void;
};

export function TechnicianCard({ technician, onPress }: TechnicianCardProps) {
  const { currentJobName, statusDetail, nextJobLabel, completedToday, earningsToday } = technician;
  const hasDetail = !!(currentJobName || statusDetail);
  const hasFooter = completedToday !== undefined || earningsToday !== undefined;

  return (
    <Pressable
      onPress={() => onPress(technician)}
      className="bg-surface-card rounded-[14px] border border-zn-border p-[14px] elevation-1"
      style={{ shadowColor: '#0e1a1f', shadowOpacity: 0.06, shadowRadius: 2 }}
    >
      <View className="flex-row items-center gap-3">
        <AvatarInitials
          initials={technician.initials}
          avatarColor={technician.avatarColor}
          size="lg"
          status={technician.status}
        />
        <View className="flex-1 min-w-0 gap-[3px]">
          <View className="flex-row items-center justify-between">
            <Text numberOfLines={1} className="text-title font-bold text-ink-900 flex-1 mr-2">
              {technician.name}
            </Text>
            <StatusBadge status={technician.status} />
          </View>
          <Text className="text-caption font-medium text-ink-500">
            {technician.skills.join(' · ')}
          </Text>
        </View>
      </View>

      {hasDetail ? (
        <View className="mt-2.5 p-[10px] pl-3 bg-surface-sunken rounded-[10px] gap-[2px]">
          {currentJobName ? (
            <View className="flex-row items-center gap-1.5">
              <Key size={13} color="#687A81" strokeWidth={2} />
              <Text className="text-body-sm font-semibold text-ink-900">{currentJobName}</Text>
            </View>
          ) : null}
          {statusDetail ? (
            <Text className={cn('text-caption text-ink-500', currentJobName && 'ml-[19px]')}>
              {statusDetail}
            </Text>
          ) : null}
          {nextJobLabel ? (
            <View className="flex-row items-center gap-1 mt-[2px]">
              <ArrowRight size={12} color="#8C9AA0" strokeWidth={2} />
              <Text className="text-caption text-ink-500">Next: {nextJobLabel}</Text>
            </View>
          ) : null}
        </View>
      ) : null}

      {hasFooter ? (
        <View className="flex-row items-center gap-5 mt-2.5 pt-2.5 border-t border-zn-border">
          {completedToday !== undefined ? (
            <View className="gap-[1px]">
              <Text
                className="text-micro font-bold uppercase text-ink-500"
                style={{ letterSpacing: 1 }}
              >
                Done Today
              </Text>
              <Text className="text-title font-extrabold text-ink-900">{completedToday}</Text>
            </View>
          ) : null}
          {completedToday !== undefined && earningsToday !== undefined ? (
            <View className="w-px h-7 bg-zn-border" />
          ) : null}
          {earningsToday !== undefined ? (
            <View className="gap-[1px]">
              <Text
                className="text-micro font-bold uppercase text-ink-500"
                style={{ letterSpacing: 1 }}
              >
                Earnings
              </Text>
              <Text className="text-title font-extrabold text-money-positive">{earningsToday}</Text>
            </View>
          ) : null}
        </View>
      ) : null}
    </Pressable>
  );
}
