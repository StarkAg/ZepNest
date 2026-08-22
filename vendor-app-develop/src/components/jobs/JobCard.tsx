import { CheckCircle, Clock, CreditCard, MapPin } from 'lucide-react-native';
import type { ComponentType } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { formatCountdown, formatRupees, getAcceptanceState } from '@/lib/utils';
import { JOB_STATUS_CONFIG, JOB_TYPE_CONFIG } from '@/src/components/jobs/jobConfig';
import { useCountdownTo } from '@/src/hooks/useCountdownTo';
import { colors } from '@/src/theme/colors';
import type { Job, JobPaymentStatus } from '@/src/types/jobs';

// Same 60s threshold as the technician-side JobDetailScreen's ACCEPT_WARNING_SECONDS.
const ACCEPT_WARNING_SECONDS = 60;

type IconProps = { size?: number; color?: string; strokeWidth?: number; fill?: string };

const PAYMENT_CONFIG: Record<
  JobPaymentStatus,
  { label: string; color: string; Icon: ComponentType<IconProps> }
> = {
  upiPaid:       { label: 'UPI paid',       color: colors.status.available.text, Icon: CheckCircle },
  cashCollected: { label: 'Cash collected', color: colors.status.available.text, Icon: CreditCard },
  unpaid:        { label: 'Unpaid',         color: colors.ink[400],              Icon: Clock },
};

type JobCardProps = {
  job: Job;
};

export function JobCard({ job }: JobCardProps) {
  const router = useRouter();
  const { typeLabel, typeKey, jobNumber, name, amount, location, timeLabel, jobStatus, payment, technician } = job;

  const typeCfg    = JOB_TYPE_CONFIG[typeKey];
  const statusCfg  = JOB_STATUS_CONFIG[jobStatus];
  const paymentCfg = PAYMENT_CONFIG[payment];
  const StatusIcon  = statusCfg.Icon;
  const PaymentIcon = paymentCfg.Icon;

  const isInProgress = jobStatus === 'inProgress';
  const isCompleted  = jobStatus === 'completed';

  const needsAcceptance = jobStatus === 'assigned' && !job.acceptedAt;
  const acceptSecondsLeft = useCountdownTo(needsAcceptance ? job.acceptDeadline : null);
  const acceptanceState = getAcceptanceState({
    status: jobStatus,
    acceptedAt: job.acceptedAt,
    acceptDeadline: job.acceptDeadline,
  });
  const acceptWarning =
    needsAcceptance && !!job.acceptDeadline && acceptSecondsLeft <= ACCEPT_WARNING_SECONDS;

  const ringColor = technician.liveStatus ? colors.status[technician.liveStatus].dot : null;
  const avatarBg  = colors.avatar[technician.avatarColor];
  const avatarSize = 28;
  const ringSize   = ringColor ? avatarSize + 4 : avatarSize;

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/job/[id]', params: { id: job.id } })}
      className="bg-surface-card rounded-[14px] border mx-4 p-3 gap-2"
      style={{
        borderColor:
          acceptanceState === 'expired'
            ? colors.status.offline.dot
            : needsAcceptance
              ? acceptWarning
                ? colors.status.offline.dot
                : colors.status.offDuty.dot
              : isInProgress
                ? colors.brand.accent
                : colors.border.subtle,
        borderWidth: acceptanceState === 'expired' || needsAcceptance || isInProgress ? 1.5 : 1,
      }}
    >
      {/* Row 1: type badge · status badge · job number */}
      <View className="flex-row items-center gap-2 flex-wrap">
        <View
          className="flex-row items-center gap-1.5 px-2 py-[4px] rounded-[6px]"
          style={{ backgroundColor: typeCfg.bg }}
        >
          <Text
            className="text-micro font-bold uppercase"
            style={{ color: typeCfg.text, letterSpacing: 0.6 }}
          >
            {typeLabel}
          </Text>
          <View className="w-px h-[10px]" style={{ backgroundColor: typeCfg.text, opacity: 0.3 }} />
          <Text className="text-micro font-semibold" style={{ color: typeCfg.text }}>
            {typeCfg.label}
          </Text>
        </View>

        <View
          className="flex-row items-center gap-1 px-2 py-[4px] rounded-[6px]"
          style={{ backgroundColor: statusCfg.bg }}
        >
          <StatusIcon size={11} color={statusCfg.text} strokeWidth={2.5} />
          <Text className="text-micro font-semibold" style={{ color: statusCfg.text }}>
            {statusCfg.label}
          </Text>
        </View>

        <Text
          className="text-caption font-medium text-ink-400 ml-auto"
          style={{ color: isCompleted ? colors.status.available.dot : undefined }}
        >
          {isCompleted ? '✓ ' : ''}{jobNumber}
        </Text>
      </View>

      {acceptanceState ? (
        <View
          className="flex-row items-center gap-1.5 rounded-[8px] px-2.5 py-1.5"
          style={{
            backgroundColor:
              acceptanceState === 'expired' ? colors.status.offline.bg : colors.status.offDuty.bg,
          }}
        >
          <Clock
            size={14}
            color={acceptanceState === 'expired' ? colors.status.offline.text : colors.status.offDuty.text}
            strokeWidth={2.5}
          />
          <Text
            className="text-body-sm font-extrabold"
            style={{
              color: acceptanceState === 'expired' ? colors.status.offline.text : colors.status.offDuty.text,
            }}
          >
            {acceptanceState === 'expired'
              ? "Technician hasn't responded — reassign to continue"
              : job.acceptDeadline
                ? `Awaiting acceptance — ${formatCountdown(acceptSecondsLeft)}`
                : 'Awaiting technician acceptance'}
          </Text>
        </View>
      ) : null}

      {/* Row 2: job name · price */}
      <View className="flex-row items-center justify-between">
        <Text className="flex-1 mr-2 text-title font-bold text-ink-900" numberOfLines={1}>
          {name}
        </Text>
        <Text className="text-title font-extrabold text-ink-900">{formatRupees(amount)}</Text>
      </View>

      {/* Row 3: location */}
      <View className="flex-row items-center gap-1.5">
        <MapPin size={12} color={colors.ink[500]} strokeWidth={2} />
        <Text className="text-caption font-medium text-ink-500">{location}</Text>
      </View>

      {/* Row 4: time · avatar + technician · payment */}
      <View className="mt-[2px] flex-row items-center border-t border-zn-border pt-[6px]">
        <View className="flex-row items-center gap-1.5 flex-1">
          <Clock size={12} color={colors.ink[500]} strokeWidth={2} />
          <Text className="text-caption font-medium text-ink-500">{timeLabel}</Text>
        </View>

        <View className="flex-row items-center gap-1.5 flex-1 justify-center">
          {/* Avatar with optional status ring */}
          <View
            style={{
              width: ringSize,
              height: ringSize,
              borderRadius: ringSize / 2,
              borderWidth: ringColor ? 2 : 0,
              borderColor: ringColor ?? 'transparent',
              backgroundColor: colors.surface.card,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                width: avatarSize,
                height: avatarSize,
                borderRadius: avatarSize / 2,
                backgroundColor: avatarBg,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 10, letterSpacing: 0.3 }}>
                {technician.initials}
              </Text>
            </View>
          </View>
          <Text className="text-caption font-medium text-ink-700" numberOfLines={1}>
            {technician.name}
          </Text>
        </View>

        <View className="flex-row items-center gap-1 flex-1 justify-end">
          <PaymentIcon size={11} color={paymentCfg.color} strokeWidth={2} />
          <Text className="text-micro font-semibold" style={{ color: paymentCfg.color }}>
            {paymentCfg.label}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
