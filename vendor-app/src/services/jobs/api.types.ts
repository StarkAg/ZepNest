// Wire shapes returned by the backend partner job endpoints (api/mobile/partner_routes.py).

export type ApiJobTechnician = {
  id: string;
  name: string;
};

// SRS §9 — mirrors partner_routes.py's _scope_change_row_to_dict exactly.
export type ApiScopeChange = {
  id: string;
  reason: string;
  description: string;
  additionalMinutes: number | null;
  originalAmount: number;
  additionalAmount: number;
  revisedTotal: number;
  photoUrl: string | null;
  status: 'pending' | 'approved' | 'declined' | 'expired';
  raisedAt: string;
  expiresAt: string;
};

export type ApiJob = {
  id: string;
  bookingNumber: string | null;
  status: string; // pending|confirmed|assigned|en_route|arrived|in_progress|completed|cancelled
  serviceName: string;
  scheduledDate: string | null;
  scheduledSlot: string | null;
  amount: number;
  serviceAddress: string | null;
  customerName: string;
  paymentStatus: string; // payment_status_enum: pending|completed|failed|refunded
  paymentMethod: string | null; // payment_method_enum: card|cash|upi|wallet, or null if no payment recorded yet
  acceptedAt: string | null; // set when the assigned technician taps Accept; null = awaiting response or declined
  assignedAt: string | null; // when the current technician was assigned/reassigned; null once declined/unassigned
  acceptDeadline: string | null; // assignedAt + 5min, computed server-side; null if assignedAt is null
  assignable: boolean;
  technician: ApiJobTechnician | null;
  beforePhotosCount: number;
  afterPhotosCount: number;
  workSummarySubmittedAt: string | null;
  otpVerifiedAt: string | null;
  scopeChange: ApiScopeChange | null;
};

export type ApiVendorTechnician = {
  id: string;
  name: string;
  status: string;
};

export type ApiJobListResponse = {
  data: ApiJob[];
};

export type ApiJobStatusHistoryEntry = {
  from: string | null;
  to: string;
  byRole: string | null;
  note: string | null;
  at: string | null;
};

export type ApiJobDetail = ApiJob & {
  statusHistory: ApiJobStatusHistoryEntry[];
  payment: { status: string; amount: number; method: string | null } | null;
};
