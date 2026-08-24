import { CheckCircle, Navigation, WifiOff, Wrench } from 'lucide-react-native';
import type { ComponentType } from 'react';
import { Text, View } from 'react-native';

import { colors } from '@/src/theme/colors';
import type { TechnicianStatus } from '@/src/types/technician';

type IconComponent = ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;

const STATUS_CONFIG: Record<TechnicianStatus, { label: string; Icon?: IconComponent }> = {
  available: { label: 'Available', Icon: CheckCircle },
  enRoute:   { label: 'En Route',  Icon: Navigation },
  onJob:     { label: 'On Job',    Icon: Wrench },
  offDuty:   { label: 'Off Duty' },
  offline:   { label: 'Offline',   Icon: WifiOff },
};

type StatusBadgeProps = {
  status: TechnicianStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, Icon } = STATUS_CONFIG[status];
  const statusColors = colors.status[status];

  return (
    <View
      className="flex-row items-center gap-1 px-2 rounded-[999px] min-h-[22px] py-[3px]"
      style={{ backgroundColor: statusColors.bg }}
    >
      {Icon && <Icon size={11} color={statusColors.text} strokeWidth={2.5} />}
      <Text className="text-label font-semibold" style={{ color: statusColors.text }}>
        {label}
      </Text>
    </View>
  );
}
