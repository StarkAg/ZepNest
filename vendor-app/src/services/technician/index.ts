import { formatDaysAgo } from '@/lib/utils';
import { api } from '@/lib/apiClient';
import type { AvatarColor } from '@/src/theme';
import type { Technician, TechnicianDetail, TechnicianReview, TechnicianStatus } from '@/src/types/technician';

import type { ApiPaginatedResponse, ApiTechnician, ApiTechnicianReview } from './api.types';

function toTechnicianReview(raw: ApiTechnicianReview): TechnicianReview {
  return {
    id: raw.id,
    reviewerMasked: raw.reviewerMasked,
    daysAgo: formatDaysAgo(raw.createdAt),
    rating: raw.rating,
    comment: raw.comment,
  };
}

const AVATAR_COLOR_PALETTE: AvatarColor[] = ['teal', 'purple', 'green', 'blue', 'amber', 'red'];

function resolveAvatarColor(id: string): AvatarColor {
  const index = Math.abs(parseInt(id, 10) || 0) % AVATAR_COLOR_PALETTE.length;
  return AVATAR_COLOR_PALETTE[index];
}

function resolveStatus(apiStatus: string): TechnicianStatus {
  switch (apiStatus) {
    case 'available': return 'available';
    case 'busy':      return 'onJob';
    case 'en_route':  return 'enRoute';
    case 'off_duty':  return 'offDuty';
    case 'offline':   return 'offline';
    default:          return 'offDuty';
  }
}

function toTechnician(raw: ApiTechnician): Technician {
  const firstName = raw.firstName ?? '';
  const lastName  = raw.lastName  ?? '';

  // API stores specialization as one comma-joined string inside a single-element array.
  const skills = raw.specialization
    .flatMap((s) => s.split(',').map((x) => x.trim()))
    .filter(Boolean);

  const firstAddress = raw.addresses[0] as Record<string, unknown> | undefined;

  return {
    id:             raw.id,
    name:           `${firstName} ${lastName}`.trim(),
    initials:       `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase(),
    avatarColor:    resolveAvatarColor(raw.id),
    skills,
    status:         resolveStatus(raw.status),
    statusDetail: firstAddress ? String(firstAddress.city ?? '') : '',
  };
}

type ApiVendorTeamTechnician = {
  id: string;
  name: string;
  status: string;
  specialization: string;
  rating: number;
  totalReviews: number;
  phone: string;
};

function toTeamTechnician(raw: ApiVendorTeamTechnician): Technician {
  const parts = raw.name.trim().split(/\s+/).filter(Boolean);
  const initials = ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || 'NA';
  const skills = (raw.specialization || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return {
    id: raw.id,
    name: raw.name,
    initials,
    avatarColor: resolveAvatarColor(raw.id),
    skills,
    status: resolveStatus(raw.status),
    statusDetail: '',
  };
}

// Token-scoped: returns the logged-in vendor's own technicians (identity from the auth token).
export async function fetchTechnicians(): Promise<Technician[]> {
  const res = await api.get<{ data: ApiVendorTeamTechnician[] }>('/mobile/vendor/technicians');
  return res.data.map(toTeamTechnician);
}

// Some fields still have no backing data in the backend (see docs/team-screen-backend-requirements.md
// §2.4, Phase 2) — those are zeroed/emptied rather than faked until that work lands. jobsDone,
// today's schedule/counts, and rating/totalReviews/recentReviews (live 30-day reviews aggregate)
// are all real, scoped to this technician.
function toTechnicianDetail(raw: ApiTechnician): TechnicianDetail {
  return {
    ...toTechnician(raw),
    rating: raw.rating,
    totalReviews: raw.totalReviews,
    ratingDelta: 0,
    acceptance: 0,
    onTimeArrival: 0,
    jobsDone: raw.jobsDone ?? 0,
    weeklyEarnings: 0,
    monthlyEarnings: 0,
    mobile: raw.phone ?? '',
    zone: '',
    partnerId: '',
    joinedDate: raw.createdAt ?? '',
    isCertifiedPartner: false,
    isBgvVerified: false,
    locationAddress: '',
    locationUpdatedAgo: '',
    todaysSchedule: raw.todaysSchedule ?? [],
    totalJobsToday: raw.totalJobsToday ?? 0,
    jobsDoneToday: raw.jobsDoneToday ?? 0,
    recentReviews: (raw.recentReviews ?? []).map(toTechnicianReview),
  };
}

// Token-scoped: the logged-in vendor's own technician, keyed by technician_profiles.technician_id
// (the same id space fetchTechnicians() above returns — not the legacy /api/technicians id space).
export async function fetchTechnicianDetail(id: string): Promise<TechnicianDetail> {
  const res = await api.get<ApiTechnician>(`/mobile/vendor/technicians/${id}`);
  return toTechnicianDetail(res);
}
