import { CheckCircle, Clock, Hourglass, MapPin, Wrench } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { formatRupees } from '@/lib/utils';
import { colors } from '@/src/theme/colors';
import type { JobTypeKey, PaymentStatusKey, ScheduledJob } from '@/src/types/technician';

const JOB_TYPE_CONFIG: Record<JobTypeKey, { label: string; bg: string; text: string }> = {
  rateCard:   { label: 'Rate Card',   bg: colors.jobType.rateCard.bg,   text: colors.jobType.rateCard.text },
  service:    { label: 'Service',     bg: colors.jobType.service.bg,     text: colors.jobType.service.text },
  highTicket: { label: 'High Ticket', bg: colors.jobType.highTicket.bg,  text: colors.jobType.highTicket.text },
};

const PAYMENT_CONFIG: Record<PaymentStatusKey, { label: string; bg: string; text: string; Icon?: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }> }> = {
  upiPaid:       { label: 'UPI paid',       bg: colors.status.available.bg, text: colors.status.available.text, Icon: CheckCircle },
  cashCollected: { label: 'Cash collected', bg: colors.status.available.bg, text: colors.status.available.text, Icon: CheckCircle },
  onJob:         { label: '',               bg: colors.status.onJob.bg,     text: colors.status.onJob.text },
  reassignable:  { label: 'Reassignable',   bg: colors.jobType.rateCard.bg, text: colors.jobType.rateCard.text },
  eta:           { label: '',               bg: colors.jobType.service.bg,  text: colors.jobType.service.text,  Icon: Hourglass },
};

type ScheduleJobCardProps = {
  job: ScheduledJob;
};

export function ScheduleJobCard({ job }: ScheduleJobCardProps) {
  const { typeLabel, typeKey, jobNumber, name, amount, location, time, paymentStatus, etaLabel, isCurrentJob } = job;
  const jobTypeCfg = JOB_TYPE_CONFIG[typeKey];
  const paymentCfg = PAYMENT_CONFIG[paymentStatus];
  const PaymentIcon = paymentCfg.Icon;
  const paymentLabel = paymentStatus === 'eta' ? (etaLabel ?? '') : paymentCfg.label;
  const isCompleted = paymentStatus === 'upiPaid' || paymentStatus === 'cashCollected';
  const showPaymentChip = !isCurrentJob && !!paymentLabel;

  return (
    <View
      className="bg-surface-card rounded-[14px] border p-3 gap-2"
      style={{
        borderColor: isCurrentJob ? colors.brand.accent : colors.border.subtle,
        borderWidth: isCurrentJob ? 1.5 : 1,
      }}
    >
      <View className="flex-row items-center gap-2 flex-wrap">
        <View
          className="flex-row items-center gap-1.5 px-2 py-[4px] rounded-[6px]"
          style={{ backgroundColor: jobTypeCfg.bg }}
        >
          <Text className="text-micro font-bold uppercase" style={{ color: jobTypeCfg.text, letterSpacing: 0.6 }}>
            {typeLabel}
          </Text>
          <View className="w-px h-[10px]" style={{ backgroundColor: jobTypeCfg.text, opacity: 0.3 }} />
          <Text className="text-micro font-semibold" style={{ color: jobTypeCfg.text }}>
            {jobTypeCfg.label}
          </Text>
        </View>
        {isCurrentJob ? (
          <View
            className="flex-row items-center gap-1 px-2 py-[4px] rounded-[6px]"
            style={{ backgroundColor: colors.status.onJob.bg }}
          >
            <Wrench size={11} color={colors.status.onJob.text} strokeWidth={2.5} />
            <Text className="text-micro font-semibold" style={{ color: colors.status.onJob.text }}>
              On Job
            </Text>
          </View>
        ) : null}
        <Text className="text-caption font-medium text-ink-400 ml-auto">
          {isCompleted ? (
            <Text className="text-caption font-medium" style={{ color: colors.status.available.dot }}>
              {'✓ '}
            </Text>
          ) : null}
          {jobNumber}
        </Text>
      </View>

      <View className="flex-row items-center justify-between">
        <Text className="mr-2 flex-1 text-title font-bold text-ink-900" numberOfLines={1}>
          {name}
        </Text>
        <Text className="text-title font-extrabold text-ink-900">{formatRupees(amount)}</Text>
      </View>

      <View className="flex-row items-center gap-1.5">
        <MapPin size={12} color={colors.ink[500]} strokeWidth={2} />
        <Text className="text-caption font-medium text-ink-500">{location}</Text>
      </View>

      <View className="mt-[2px] flex-row items-center justify-between border-t border-zn-border pt-[6px]">
        <View className="flex-row items-center gap-1.5">
          <Clock size={12} color={colors.ink[500]} strokeWidth={2} />
          <Text className="text-caption font-medium text-ink-500">{time}</Text>
        </View>
        {showPaymentChip ? (
          <View
            className="flex-row items-center gap-1 px-2 py-[4px] rounded-[6px]"
            style={{ backgroundColor: paymentCfg.bg }}
          >
            {PaymentIcon ? <PaymentIcon size={11} color={paymentCfg.text} strokeWidth={2.5} /> : null}
            <Text className="text-micro font-semibold" style={{ color: paymentCfg.text }}>
              {paymentLabel}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}
