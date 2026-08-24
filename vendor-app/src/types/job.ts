import type { AvatarColor } from '@/src/theme';
import type { JobTypeKey } from '@/src/types/technician';

// Canonical booking lifecycle the technician drives (mirrors the backend status flow).
export type JobStatus = 'assigned' | 'enRoute' | 'arrived' | 'inProgress' | 'completed';

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

export type TodaysJob = {
  id: string;
  jobNumber: string;
  typeLabel: string;
  typeKey: JobTypeKey;
  categoryLabel: string;
  serviceName: string;
  amount: number;
  timeSlot: string;
  locality: string;
  fullAddress: string;
  customerName: string;
  customerPhone: string;
  paymentMethod: string;
  paymentMethodRaw: string | null;
  paymentStatus: string;
  acceptedAt: string | null;
  assignedAt: string | null;
  acceptDeadline: string | null;
  status: JobStatus;
  nextJobInMinutes?: number;
  beforePhotosCount: number;
  afterPhotosCount: number;
  workSummarySubmittedAt: string | null;
  otpVerifiedAt: string | null;
  scopeChange: ScopeChange | null;
};

export type TechnicianProfile = {
  name: string;
  initials: string;
  avatarColor: AvatarColor;
};

export type TodaysEarnings = {
  amount: number;
  jobsDone: number;
  jobsTotal: number;
};
