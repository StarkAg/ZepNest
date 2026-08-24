import { MapPin, Navigation, Wrench } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { colors } from '@/src/theme/colors';
import type { JobStatus, TodaysJob } from '@/src/types/job';

type ActiveJobBannerProps = {
  job: TodaysJob;
};

type ActiveStatus = 'enRoute' | 'arrived' | 'inProgress';
const ACTIVE_STATUSES: JobStatus[] = ['enRoute', 'arrived', 'inProgress'];

const STATUS_LABEL: Record<ActiveStatus, { label: string; Icon: typeof Navigation; statusKey: keyof typeof colors.status }> = {
  enRoute: { label: 'En route', Icon: Navigation, statusKey: 'enRoute' },
  arrived: { label: 'Arrived', Icon: MapPin, statusKey: 'onJob' },
  inProgress: { label: 'In progress', Icon: Wrench, statusKey: 'onJob' },
};

export function ActiveJobBanner({ job }: ActiveJobBannerProps) {
  if (!ACTIVE_STATUSES.includes(job.status)) return null;

  const { label, Icon, statusKey } = STATUS_LABEL[job.status as ActiveStatus];
  const tone = colors.status[statusKey];

  return (
    <View
      className="mx-4 mt-3 flex-row items-center gap-2 rounded-[10px] px-3 py-2"
      style={{ backgroundColor: tone.bg }}>
      <Icon size={16} color={tone.text} strokeWidth={2.25} />
      <Text
        className="flex-1 text-body-sm font-semibold"
        style={{ color: tone.text }}
        numberOfLines={1}>
        {label} → {job.serviceName} · {job.jobNumber}
      </Text>
    </View>
  );
}
