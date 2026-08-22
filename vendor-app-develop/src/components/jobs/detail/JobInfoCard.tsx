import { Clipboard, Clock, Lock, MapPin, Phone, User } from 'lucide-react-native';
import type { ComponentType } from 'react';
import { Pressable, Text, View } from 'react-native';

import { getAcceptanceState } from '@/lib/utils';
import { JOB_TYPE_CONFIG } from '@/src/components/jobs/jobConfig';
import { colors } from '@/src/theme/colors';
import type { JobDetail } from '@/src/types/jobs';
import type { JobTypeKey } from '@/src/types/technician';

type IconProps = { size?: number; color?: string; strokeWidth?: number };

function InfoRow({
  Icon,
  label,
  children,
}: {
  Icon: ComponentType<IconProps>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View className="flex-row gap-3 py-3 border-b border-zn-border last:border-b-0">
      <View
        className="w-8 h-8 rounded-[8px] items-center justify-center mt-[1px]"
        style={{ backgroundColor: colors.surface.sunken }}
      >
        <Icon size={15} color={colors.ink[500]} strokeWidth={2} />
      </View>
      <View className="flex-1 gap-[2px]">
        <Text className="text-micro font-bold uppercase text-ink-500" style={{ letterSpacing: 0.7 }}>
          {label}
        </Text>
        {children}
      </View>
    </View>
  );
}

function TypeBadge({ typeKey, typeLabel }: { typeKey: JobTypeKey; typeLabel: string }) {
  const cfg = JOB_TYPE_CONFIG[typeKey];
  return (
    <View
      className="self-start flex-row items-center gap-1.5 px-2.5 py-[5px] rounded-[6px] mb-3"
      style={{ backgroundColor: cfg.bg }}
    >
      <Text
        className="text-micro font-bold uppercase"
        style={{ color: cfg.text, letterSpacing: 0.6 }}
      >
        {typeLabel}
      </Text>
      <View className="w-px h-[10px]" style={{ backgroundColor: cfg.text, opacity: 0.3 }} />
      <Text className="text-micro font-semibold" style={{ color: cfg.text }}>
        {cfg.label}
      </Text>
    </View>
  );
}

type JobInfoCardProps = {
  job: JobDetail;
  onCallTechnician: () => void;
};

export function JobInfoCard({ job, onCallTechnician }: JobInfoCardProps) {
  const { typeKey, typeLabel, name, amount, customer, fullAddress, addressHidden, timeLabel, servicesBooked, technician } = job;

  const acceptanceState = getAcceptanceState({
    status: job.jobStatus,
    acceptedAt: job.acceptedAt,
    acceptDeadline: job.acceptDeadline,
  });

  const ringColor = technician.liveStatus ? colors.status[technician.liveStatus].dot : null;
  const avatarSize = 40;
  const ringSize = ringColor ? avatarSize + 5 : avatarSize;

  return (
    <View className="mx-4 mt-4">
      <TypeBadge typeKey={typeKey} typeLabel={typeLabel} />

      <View className="flex-row items-start justify-between mb-4">
        <Text className="text-h2 font-bold text-ink-900 flex-1 mr-3" style={{ letterSpacing: -0.3 }}>
          {name}
        </Text>
        <Text className="text-h2 font-extrabold text-ink-900" style={{ letterSpacing: -0.5 }}>
          ₹{amount.toLocaleString('en-IN')}
        </Text>
      </View>

      <View className="bg-surface-card rounded-[14px] border border-zn-border px-4">
        <InfoRow Icon={User} label="Customer">
          <Text className="text-body-sm font-semibold text-ink-900">{customer}</Text>
        </InfoRow>

        <InfoRow Icon={addressHidden ? Lock : MapPin} label="Address">
          {addressHidden ? (
            <Text className="text-body-sm text-ink-500 italic">
              Revealed once technician is En Route
            </Text>
          ) : (
            <Text className="text-body-sm font-medium text-ink-900">{fullAddress}</Text>
          )}
        </InfoRow>

        <InfoRow Icon={Clock} label="Time Slot">
          <Text className="text-body-sm font-semibold text-ink-900">{timeLabel}</Text>
        </InfoRow>

        <InfoRow Icon={Clipboard} label="Services Booked">
          <View className="gap-[3px]">
            {servicesBooked.map((s, i) => (
              <Text key={i} className="text-body-sm font-medium text-ink-900">
                · {s}
              </Text>
            ))}
          </View>
        </InfoRow>

        <View className="flex-row items-center gap-3 py-3 border-t border-zn-border">
          <View
            style={{
              width: ringSize, height: ringSize, borderRadius: ringSize / 2,
              borderWidth: ringColor ? 2.5 : 0, borderColor: ringColor ?? 'transparent',
              backgroundColor: colors.surface.card, alignItems: 'center', justifyContent: 'center',
            }}
          >
            <View
              style={{
                width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2,
                backgroundColor: colors.avatar[technician.avatarColor],
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 14, letterSpacing: 0.3 }}>
                {technician.initials}
              </Text>
            </View>
          </View>

          <View className="flex-1 gap-[1px]">
            <Text className="text-micro font-bold uppercase text-ink-500" style={{ letterSpacing: 0.7 }}>
              Assigned Technician
            </Text>
            <Text className="text-body-sm font-semibold text-ink-900">{technician.name}</Text>
          </View>

          <Pressable
            onPress={onCallTechnician}
            className="w-10 h-10 rounded-[999px] items-center justify-center border border-zn-border bg-surface-card"
          >
            <Phone size={16} color={colors.brand.accent} strokeWidth={2} />
          </Pressable>
        </View>

        {acceptanceState ? (
          <View
            className="mb-3 flex-row items-center gap-2 rounded-[8px] border-2 px-3 py-2.5"
            style={{
              backgroundColor:
                acceptanceState === 'expired' ? colors.status.offline.bg : colors.status.offDuty.bg,
              borderColor:
                acceptanceState === 'expired' ? colors.status.offline.dot : colors.status.offDuty.dot,
            }}
          >
            <Clock
              size={16}
              color={acceptanceState === 'expired' ? colors.status.offline.text : colors.status.offDuty.text}
              strokeWidth={2.5}
            />
            <Text
              className="flex-1 text-body-sm font-extrabold"
              style={{
                color:
                  acceptanceState === 'expired' ? colors.status.offline.text : colors.status.offDuty.text,
              }}
            >
              {acceptanceState === 'expired'
                ? "Technician hasn't responded — reassign to continue"
                : 'Awaiting technician acceptance'}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}
