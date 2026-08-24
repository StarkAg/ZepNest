import {
  CheckCircle,
  Clipboard,
  CreditCard,
  Clock,
  Home,
  Key,
  Navigation,
} from 'lucide-react-native';
import type { ComponentType } from 'react';

import { colors } from '@/src/theme/colors';
import type { JobTypeKey } from '@/src/types/technician';
import type { JobDetailPaymentType, JobStatus } from '@/src/types/jobs';

type IconProps = { size?: number; color?: string; strokeWidth?: number; fill?: string };

export const JOB_TYPE_CONFIG: Record<JobTypeKey, { label: string; bg: string; text: string }> = {
  rateCard:   { label: 'Rate Card',   bg: colors.jobType.rateCard.bg,   text: colors.jobType.rateCard.text },
  service:    { label: 'Service',     bg: colors.jobType.service.bg,     text: colors.jobType.service.text },
  highTicket: { label: 'High Ticket', bg: colors.jobType.highTicket.bg,  text: colors.jobType.highTicket.text },
};

export const JOB_STATUS_CONFIG: Record<
  JobStatus,
  { label: string; bg: string; text: string; Icon: ComponentType<IconProps>; dotColor: string }
> = {
  assigned:   { label: 'Assigned',    bg: colors.status.offDuty.bg,   text: colors.status.offDuty.text,   Icon: Clipboard,  dotColor: colors.ink[400] },
  enRoute:    { label: 'En Route',    bg: colors.status.enRoute.bg,   text: colors.status.enRoute.text,   Icon: Navigation, dotColor: colors.status.enRoute.dot },
  arrived:    { label: 'Arrived',     bg: colors.status.enRoute.bg,   text: colors.status.enRoute.text,   Icon: Home,       dotColor: colors.status.enRoute.dot },
  inProgress: { label: 'In Progress', bg: colors.status.onJob.bg,     text: colors.status.onJob.text,     Icon: Key,        dotColor: colors.status.onJob.dot },
  completed:  { label: 'Completed',   bg: colors.status.available.bg, text: colors.status.available.text, Icon: CheckCircle, dotColor: colors.status.available.dot },
};

export const DETAIL_PAYMENT_CONFIG: Record<
  JobDetailPaymentType,
  { label: string; subLabel: string; iconBg: string; iconColor: string; Icon: ComponentType<IconProps> }
> = {
  upiPaid:    { label: 'UPI paid',     subLabel: 'Paid via UPI QR',              iconBg: colors.status.available.bg, iconColor: colors.status.available.text, Icon: CheckCircle },
  codPending: { label: 'COD pending',  subLabel: 'Cash to collect on completion', iconBg: colors.status.enRoute.bg,   iconColor: colors.status.enRoute.text,   Icon: CreditCard },
  unpaid:     { label: 'Unpaid',       subLabel: 'Awaiting job completion',       iconBg: colors.surface.sunken,      iconColor: colors.ink[400],              Icon: Clock },
};

export const STATUS_ORDER: JobStatus[] = ['assigned', 'enRoute', 'arrived', 'inProgress', 'completed'];
