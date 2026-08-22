import type { ScheduledJob } from '@/src/types/technician';

// Raw shape returned by GET /mobile/vendor/technicians/:id (and legacy GET /api/technicians).
// Private to this service — never import these in UI components.

// rating/totalReviews/recentReviews are computed live from the reviews table (last 30 days) —
// see api/mobile/partner_routes.py::vendor_technician_detail.
export type ApiTechnicianReview = {
  id: string;
  rating: number;
  comment: string;
  reviewerMasked: string;
  createdAt: string | null;
};

export type ApiTechnician = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string[];   // single-element array; value is comma-separated: ["Electrical, Plumbing"]
  experience: number;
  status: string;             // 'available' | 'busy' | 'en_route' | 'off_duty' | 'offline'
  addresses: unknown[];
  rating: number;
  totalReviews: number;
  recentReviews?: ApiTechnicianReview[];
  certifications: string[];
  createdAt: string | null;
  jobsDone?: number;
  todaysSchedule?: ScheduledJob[];
  totalJobsToday?: number;
  jobsDoneToday?: number;
};

export type ApiPaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
