import { BadgeCheck, MapPin, Phone, Shield } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { AvatarInitials } from '@/src/components/ui/AvatarInitials';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { colors } from '@/src/theme/colors';
import type { TechnicianDetail } from '@/src/types/technician';

type ProfileCardProps = {
  technician: TechnicianDetail;
};

function InfoField({ label, value, Icon }: { label: string; value: string; Icon?: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }> }) {
  return (
    <View className="gap-[2px]">
      <Text className="text-micro font-bold uppercase text-ink-500" style={{ letterSpacing: 0.8 }}>
        {label}
      </Text>
      <View className="flex-row items-center gap-1">
        {Icon ? <Icon size={13} color={colors.ink[500]} strokeWidth={2} /> : null}
        <Text className="text-body-sm font-semibold text-ink-900">{value}</Text>
      </View>
    </View>
  );
}

function SkillChip({ label }: { label: string }) {
  return (
    <View className="px-3 py-[6px] rounded-[999px] border border-zn-border bg-surface-sunken">
      <Text className="text-label font-medium text-ink-700">{label}</Text>
    </View>
  );
}

export function ProfileCard({ technician }: ProfileCardProps) {
  const {
    name,
    initials,
    avatarColor,
    status,
    skills,
    rating,
    mobile,
    zone,
    partnerId,
    joinedDate,
    isCertifiedPartner,
    isBgvVerified,
  } = technician;

  return (
    <View className="bg-surface-card rounded-[14px] border border-zn-border p-4 mx-4 mt-4 gap-4">
      <View className="flex-row items-center gap-3">
        <AvatarInitials initials={initials} avatarColor={avatarColor} size="lg" status={status} />
        <View className="flex-1 min-w-0 gap-[3px]">
          <Text className="text-h3 font-bold text-ink-900" style={{ letterSpacing: -0.2 }}>
            {name}
          </Text>
          <Text className="text-caption font-medium text-ink-500">{skills.join(' · ')}</Text>
          <View className="flex-row items-center gap-2 mt-1">
            <StatusBadge status={status} />
            <View className="flex-row items-center gap-1">
              <Text className="text-caption text-ink-500">★</Text>
              <Text className="text-caption font-semibold text-ink-700">{rating.toFixed(1)}</Text>
            </View>
          </View>
        </View>
      </View>

      {(isCertifiedPartner || isBgvVerified) ? (
        <View className="flex-row items-center gap-2 flex-wrap">
          {isCertifiedPartner ? (
            <View
              className="flex-row items-center gap-1 px-2.5 py-[5px] rounded-[999px] border"
              style={{ borderColor: colors.brand.accent, backgroundColor: colors.brand.soft }}
            >
              <Shield size={12} color={colors.brand.accent} strokeWidth={2.5} />
              <Text className="text-micro font-semibold" style={{ color: colors.brand.accent }}>
                Certified Partner
              </Text>
            </View>
          ) : null}
          {isBgvVerified ? (
            <View
              className="flex-row items-center gap-1 px-2.5 py-[5px] rounded-[999px] border"
              style={{ borderColor: colors.status.available.dot, backgroundColor: colors.status.available.bg }}
            >
              <BadgeCheck size={12} color={colors.status.available.dot} strokeWidth={2.5} />
              <Text className="text-micro font-semibold" style={{ color: colors.status.available.text }}>
                BGV Verified
              </Text>
            </View>
          ) : null}
        </View>
      ) : null}

      <View className="border-t border-zn-border pt-3 gap-3">
        <View className="flex-row gap-6">
          <InfoField label="Mobile" value={mobile} Icon={Phone} />
          <InfoField label="Zone" value={zone} Icon={MapPin} />
        </View>
        <View className="flex-row gap-6">
          <InfoField label="Partner ID" value={partnerId} />
          <InfoField label="Joined" value={joinedDate} />
        </View>
      </View>

      <View className="border-t border-zn-border pt-3 gap-2">
        <Text className="text-micro font-bold uppercase text-ink-500" style={{ letterSpacing: 0.8 }}>
          Skill Categories
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {skills.map((skill) => (
            <SkillChip key={skill} label={skill} />
          ))}
        </View>
      </View>
    </View>
  );
}
