import type { AvatarColor, StatusKey } from '@/src/theme';

export type TechnicianStatus = StatusKey;

export type Technician = {
  id: string;
  name: string;
  initials: string;
  avatarColor: AvatarColor;
  skills: string[];
  status: TechnicianStatus;
  statusDetail: string;
  currentJobName?: string;
  nextJobLabel?: string;
  completedToday?: number;
  earningsToday?: string;
};

export type JobTypeKey = 'rateCard' | 'service' | 'highTicket';
export type PaymentStatusKey = 'upiPaid' | 'cashCollected' | 'onJob' | 'reassignable' | 'eta';

export type ScheduledJob = {
  id: string;
  jobNumber: string;
  typeLabel: string;
  typeKey: JobTypeKey;
  name: string;
  amount: number;
  location: string;
  time: string;
  paymentStatus: PaymentStatusKey;
  etaLabel?: string;
  isCurrentJob?: boolean;
};

export type TechnicianReview = {
  id: string;
  reviewerMasked: string;
  daysAgo: string;
  rating: number;
  comment: string;
};

export type TechnicianDetail = Technician & {
  rating: number;
  ratingDelta: number;
  acceptance: number;
  onTimeArrival: number;
  jobsDone: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
  mobile: string;
  zone: string;
  partnerId: string;
  joinedDate: string;
  isCertifiedPartner: boolean;
  isBgvVerified: boolean;
  locationAddress: string;
  locationUpdatedAgo: string;
  todaysSchedule: ScheduledJob[];
  totalJobsToday: number;
  jobsDoneToday: number;
  recentReviews: TechnicianReview[];
  totalReviews: number;
};
