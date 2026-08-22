import { CheckCircle, Clock, MapPin, Navigation, Wrench } from 'lucide-react-native';
import type { ComponentType } from 'react';
import { Text, View } from 'react-native';

import { colors } from '@/src/theme/colors';
import type { JobStatus } from '@/src/types/job';

type IconComponent = ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;

const STATUS_CONFIG: Record<
  JobStatus,
  { label: string; Icon: IconComponent; statusKey: keyof typeof colors.status }
> = {
  assigned: { label: 'Assigned', Icon: Clock, statusKey: 'offDuty' },
  enRoute: { label: 'En route', Icon: Navigation, statusKey: 'enRoute' },
  arrived: { label: 'Arrived', Icon: MapPin, statusKey: 'onJob' },
  inProgress: { label: 'In progress', Icon: Wrench, statusKey: 'onJob' },
  completed: { label: 'Completed', Icon: CheckCircle, statusKey: 'available' },
};

type JobStatusBadgeProps = {
  status: JobStatus;
};

export function JobStatusBadge({ status }: JobStatusBadgeProps) {
  const { label, Icon, statusKey } = STATUS_CONFIG[status];
  const tone = colors.status[statusKey];

  return (
    <View
      className="flex-row items-center gap-1 rounded-[6px] px-2 py-[4px]"
      style={{ backgroundColor: tone.bg }}>
      <Icon size={11} color={tone.text} strokeWidth={2.5} />
      <Text className="text-micro font-semibold" style={{ color: tone.text }}>
        {label}
      </Text>
    </View>
  );
}
