import { Clock, MapPin } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { formatCountdown, formatRupees, getAcceptanceState } from '@/lib/utils';
import { useCountdownTo } from '@/src/hooks/useCountdownTo';
import { colors } from '@/src/theme/colors';
import type { TodaysJob } from '@/src/types/job';

import { JobStatusBadge } from './JobStatusBadge';

// Same 60s threshold as JobDetailScreen's ACCEPT_WARNING_SECONDS — kept local since a shared
// constant would need its own module for a single number used in two files.
const ACCEPT_WARNING_SECONDS = 60;

type JobCardProps = {
  job: TodaysJob;
  onPress: () => void;
};

export function JobCard({ job, onPress }: JobCardProps) {
  const jobTypeColors = colors.jobType[job.typeKey];
  const isActive = job.status === 'enRoute' || job.status === 'arrived' || job.status === 'inProgress';
  const address = isActive ? job.fullAddress : job.locality;

  const needsAcceptance = job.status === 'assigned' && !job.acceptedAt;
  const acceptSecondsLeft = useCountdownTo(needsAcceptance ? job.acceptDeadline : null);
  const acceptanceState = needsAcceptance ? getAcceptanceState(job) : null;
  const acceptWarning =
    needsAcceptance && !!job.acceptDeadline && acceptSecondsLeft <= ACCEPT_WARNING_SECONDS;

  return (
    <Pressable
      onPress={onPress}
      className="gap-2 rounded-[14px] border bg-surface-card p-3"
      style={{
        borderColor: needsAcceptance
          ? acceptWarning
            ? colors.status.offline.dot
            : colors.status.offDuty.dot
          : isActive
            ? colors.brand.accent
            : colors.border.subtle,
        borderWidth: needsAcceptance || isActive ? 1.5 : 1,
      }}>
      <View className="flex-row flex-wrap items-center gap-2">
        <View
          className="flex-row items-center gap-1.5 rounded-[6px] px-2 py-[4px]"
          style={{ backgroundColor: jobTypeColors.bg }}>
          <Text
            className="text-micro font-bold uppercase"
            style={{ color: jobTypeColors.text, letterSpacing: 0.6 }}>
            {job.typeLabel}
          </Text>
          <View
            className="h-[10px] w-px"
            style={{ backgroundColor: jobTypeColors.text, opacity: 0.3 }}
          />
          <Text className="text-micro font-semibold" style={{ color: jobTypeColors.text }}>
            {job.categoryLabel}
          </Text>
        </View>

        {job.status === 'completed' || isActive ? <JobStatusBadge status={job.status} /> : null}

        {job.status === 'assigned' && job.nextJobInMinutes !== undefined ? (
          <Text className="text-caption font-medium text-ink-400">
            Next job in {job.nextJobInMinutes} min
          </Text>
        ) : null}

        <Text className="ml-auto text-caption font-medium text-ink-400">{job.jobNumber}</Text>
      </View>

      {needsAcceptance ? (
        <View
          className="flex-row items-center gap-1.5 rounded-[8px] px-2.5 py-1.5"
          style={{
            backgroundColor: acceptWarning ? colors.status.offline.bg : colors.status.offDuty.bg,
          }}>
          <Clock
            size={14}
            color={acceptWarning ? colors.status.offline.text : colors.status.offDuty.text}
            strokeWidth={2.5}
          />
          <Text
            className="text-body-sm font-extrabold"
            style={{ color: acceptWarning ? colors.status.offline.text : colors.status.offDuty.text }}>
            {acceptanceState === 'expired'
              ? 'Response window ended'
              : job.acceptDeadline
                ? `Respond within ${formatCountdown(acceptSecondsLeft)}`
                : 'Accept or decline to continue'}
          </Text>
        </View>
      ) : null}

      <View className="flex-row items-center justify-between">
        <Text className="mr-2 flex-1 text-title font-bold text-ink-900" numberOfLines={1}>
          {job.serviceName}
        </Text>
        <Text className="text-title font-extrabold text-ink-900">{formatRupees(job.amount)}</Text>
      </View>

      <View className="flex-row items-center gap-1.5">
        <MapPin size={12} color={colors.ink[500]} strokeWidth={2} />
        <Text className="text-caption font-medium text-ink-500" numberOfLines={1}>
          {address}
        </Text>
      </View>

      <View className="mt-[2px] flex-row items-center gap-1.5 border-t border-zn-border pt-[6px]">
        <Clock size={12} color={colors.ink[500]} strokeWidth={2} />
        <Text className="text-caption font-medium text-ink-500">{job.timeSlot}</Text>
      </View>
    </Pressable>
  );
}
