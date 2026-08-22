import type { AvatarColor, StatusKey } from '@/src/theme';

import type { JobTypeKey } from './technician';

export type JobStatus = 'inProgress' | 'arrived' | 'enRoute' | 'assigned' | 'completed';
export type JobSortKey = 'time' | 'status' | 'technician' | 'amount';
export type JobPaymentStatus = 'upiPaid' | 'cashCollected' | 'unpaid';
export type JobPeriod = 'today' | 'tomorrow' | 'thisWeek';

export type JobTechnician = {
  name: string;
  initials: string;
  avatarColor: AvatarColor;
  liveStatus?: StatusKey;
};

export type Job = {
  id: string;
  jobNumber: string;
  typeLabel: string;
  typeKey: JobTypeKey;
  name: string;
  amount: number;
  location: string;
  timeLabel: string;
  jobStatus: JobStatus;
  payment: JobPaymentStatus;
  technician: JobTechnician;
  acceptedAt: string | null;
  assignedAt: string | null;
  acceptDeadline: string | null;
};

export type StatusLogEntry = {
  status: JobStatus;
  time?: string;
  isCurrent?: boolean;
};

// SRS §9 — mirrors api/mobile/partner_routes.py's scopeChange JSON exactly.
export type ScopeChangeStatus = 'pending' | 'approved' | 'declined' | 'expired';

export type ScopeChange = {
  id: string;
  reason: string;
  description: string;
  additionalMinutes: number | null;
  originalAmount: number;
  additionalAmount: number;
  revisedTotal: number;
  photoUrl: string | null;
  status: ScopeChangeStatus;
  raisedAt: string;
  expiresAt: string;
};

export type JobDetailPaymentType = 'upiPaid' | 'codPending' | 'unpaid';

export type JobDetailPayment = {
  type: JobDetailPaymentType;
  amount: number;
};

export type PhotoSet = {
  uploaded: number;
  minimum: number;
};

export type CustomerRating = {
  rating: number;
  reviewerName: string;
  comment: string;
};

export type JobDetail = Job & {
  customer: string;
  fullAddress: string;
  addressHidden: boolean;
  servicesBooked: string[];
  statusLog: StatusLogEntry[];
  scopeChange?: ScopeChange;
  detailPayment: JobDetailPayment;
  beforePhotos: PhotoSet;
  afterPhotos?: PhotoSet;
  customerRating?: CustomerRating;
};
