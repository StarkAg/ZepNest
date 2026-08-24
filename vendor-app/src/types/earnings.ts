import type { AvatarColor } from '@/src/theme';
import type { JobTypeKey } from '@/src/types/technician';

export type { JobTypeKey };

export type EarningsPeriod = 'thisWeek' | 'thisMonth' | 'custom';
type SettlementStatus = 'pending' | 'inProgress';
export type BreakdownIconKey = 'rupee' | 'percent' | 'trending' | 'refresh';
type AmountVariant = 'neutral' | 'deduction' | 'addition';

export interface NetPayoutData {
  label: string;
  settlementStatus: SettlementStatus;
  netPayout: number;
  grossRevenue: number;
  nextPayoutLabel: string;
}

export interface BreakdownItem {
  id: string;
  icon: BreakdownIconKey;
  label: string;
  sublabel: string;
  amount: number;
  variant: AmountVariant;
}

export interface DayBar {
  day: string;
  amount: number;
  isToday: boolean;
}

export interface JobTypeData {
  key: JobTypeKey;
  label: string;
  typeLabel: string;
  percent: number;
  amount: number;
}

export interface TechnicianEarning {
  id: string;
  initials: string;
  avatarColor: AvatarColor;
  name: string;
  specialties: string;
  jobsDone: number;
  percent: number;
  grossAmount: number;
  netAmount: number;
  platformFee: number;
  avgPerJob: number;
}

export interface JobSettlement {
  id: string;
  jobTypeKey: JobTypeKey;
  jobTypeLabel: string;
  name: string;
  jobNumber: string;
  date: string;
  time: string;
  netAmount: number;
  grossAmount: number;
  platformFee: number;
  technicianName: string;
  paymentMethod: string;
}
