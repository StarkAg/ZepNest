import { api } from '@/lib/apiClient';
import type { AvatarColor } from '@/src/theme';
import type {
  Job,
  JobDetail,
  JobPaymentStatus,
  JobPeriod,
  JobStatus,
  StatusLogEntry,
} from '@/src/types/jobs';

import type { ApiJob, ApiJobDetail, ApiJobListResponse, ApiVendorTechnician } from './api.types';

export type VendorTechnicianOption = { id: string; name: string; status: string };

const AVATAR_COLOR_PALETTE: AvatarColor[] = ['teal', 'purple', 'green', 'blue', 'amber', 'red'];

function resolveAvatarColor(id: string): AvatarColor {
  return AVATAR_COLOR_PALETTE[Math.abs(parseInt(id, 10) || 0) % AVATAR_COLOR_PALETTE.length];
}

function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase();
}

// Backend booking status -> UI JobStatus. Terminal `cancelled` is surfaced as `completed`
// (past bucket); pre-assignment states collapse to `assigned`.
export function mapJobStatus(apiStatus: string): JobStatus {
  switch ((apiStatus || '').toLowerCase()) {
    case 'en_route': return 'enRoute';
    case 'arrived': return 'arrived';
    case 'in_progress': return 'inProgress';
    case 'completed':
    case 'cancelled': return 'completed';
    case 'assigned':
    case 'confirmed':
    case 'pending':
    default: return 'assigned';
  }
}

function mapPayment(paymentStatus: string): JobPaymentStatus {
  return (paymentStatus || '').toLowerCase() === 'completed' ? 'upiPaid' : 'unpaid';
}

// The backend does not yet classify job type (rateCard/service/highTicket). Default to Type 1
// until a job-tier source exists (see jobs-screen-backend-requirements.md).
function toJob(raw: ApiJob): Job {
  const techName = raw.technician?.name?.trim() || 'Unassigned';
  const techId = raw.technician?.id ?? '0';
  return {
    id: raw.id,
    jobNumber: raw.bookingNumber ? `#${raw.bookingNumber}` : `#${raw.id}`,
    typeLabel: 'TYPE 1',
    typeKey: 'rateCard',
    name: raw.serviceName || 'Service booking',
    amount: raw.amount,
    location: raw.serviceAddress || '—',
    timeLabel: raw.scheduledSlot || (raw.scheduledDate ?? ''),
    jobStatus: mapJobStatus(raw.status),
    payment: mapPayment(raw.paymentStatus),
    technician: {
      name: techName,
      initials: initialsFrom(techName) || 'NA',
      avatarColor: resolveAvatarColor(techId),
    },
    acceptedAt: raw.acceptedAt ?? null,
    assignedAt: raw.assignedAt ?? null,
    acceptDeadline: raw.acceptDeadline ?? null,
  };
}

const PERIOD_PARAM: Record<JobPeriod, string> = {
  today: 'today',
  tomorrow: 'tomorrow',
  thisWeek: 'week',
};

export async function fetchVendorJobs(period?: JobPeriod): Promise<Job[]> {
  // include=unassigned also surfaces the open pool of new customer bookings so the vendor can assign one.
  const query = period ? `?period=${PERIOD_PARAM[period]}&include=unassigned` : '?include=unassigned';
  const res = await api.get<ApiJobListResponse>(`/mobile/vendor/jobs${query}`);
  return res.data.map(toJob);
}

// Raw (unmapped) status so a cancelled booking isn't counted as done — mapJobStatus collapses
// cancelled into the same bucket as completed for Jobs-tab display purposes only.
export async function fetchCompletedJobsCountToday(): Promise<number> {
  const res = await api.get<ApiJobListResponse>('/mobile/vendor/jobs?period=today');
  return res.data.filter((job) => job.status === 'completed').length;
}

export async function fetchVendorTechnicians(): Promise<VendorTechnicianOption[]> {
  const res = await api.get<{ data: ApiVendorTechnician[] }>('/mobile/vendor/technicians');
  return res.data.map((t) => ({ id: t.id, name: t.name, status: t.status }));
}

export async function fetchVendorJobDetail(id: string): Promise<JobDetail> {
  const raw = await api.get<ApiJobDetail>(`/mobile/vendor/jobs/${id}`);
  const base = toJob(raw);
  const statusLog: StatusLogEntry[] = (raw.statusHistory ?? []).map((h) => ({
    status: mapJobStatus(h.to),
    time: h.at ?? undefined,
  }));
  if (statusLog.length > 0) statusLog[statusLog.length - 1].isCurrent = true;

  return {
    ...base,
    customer: raw.customerName || '—',
    fullAddress: raw.serviceAddress || '—',
    addressHidden: false,
    servicesBooked: [raw.serviceName || 'Service booking'],
    statusLog,
    detailPayment: {
      type: raw.payment?.status === 'completed' ? 'upiPaid' : 'unpaid',
      amount: raw.payment?.amount ?? raw.amount,
    },
    beforePhotos: { uploaded: 0, minimum: 2 },
    scopeChange: raw.scopeChange ?? undefined,
  };
}

// Vendor assigns/reassigns a job to one of their technicians.
export async function assignJobToTechnician(jobId: string, technicianId: string): Promise<void> {
  await api.post(`/mobile/vendor/jobs/${jobId}/assign`, { technicianId });
}
