import * as FileSystem from 'expo-file-system/legacy';

import { api } from '@/lib/apiClient';
import type { ApiJob } from '@/src/services/jobs/api.types';
import type { JobStatus, TodaysJob } from '@/src/types/job';

// Toggle technician availability. Backend writes technician_profiles.status available<->offline
// for the technician resolved from the auth token. (api/mobile/partner_routes.py)
export async function setOnlineStatus(isOnline: boolean): Promise<void> {
  await api.post('/mobile/technician/status', { isOnline });
}

// Backend booking status -> UI JobStatus (camelCase). Pre-assignment states collapse to assigned.
function mapTechStatus(s: string): JobStatus {
  switch ((s || '').toLowerCase()) {
    case 'en_route':
      return 'enRoute';
    case 'arrived':
      return 'arrived';
    case 'in_progress':
      return 'inProgress';
    case 'completed':
      return 'completed';
    default:
      return 'assigned';
  }
}

// UI JobStatus -> backend status string for the transition endpoint.
const TO_BACKEND_STATUS: Record<JobStatus, string> = {
  assigned: 'assigned',
  enRoute: 'en_route',
  arrived: 'arrived',
  inProgress: 'in_progress',
  completed: 'completed',
};

function toTodaysJob(raw: ApiJob): TodaysJob {
  return {
    id: raw.id,
    jobNumber: raw.bookingNumber ? `#${raw.bookingNumber}` : `#${raw.id}`,
    typeLabel: 'TYPE 1',
    typeKey: 'rateCard',
    categoryLabel: 'Service',
    serviceName: raw.serviceName || 'Service booking',
    amount: raw.amount,
    timeSlot: raw.scheduledSlot || (raw.scheduledDate ?? ''),
    locality: raw.serviceAddress || '—',
    fullAddress: raw.serviceAddress || '—',
    customerName: raw.customerName || '—',
    customerPhone: '',
    paymentMethod:
      (raw.paymentStatus || '').toLowerCase() === 'completed' ? 'Paid' : 'Collect on completion',
    paymentMethodRaw: raw.paymentMethod ?? null,
    paymentStatus: raw.paymentStatus || 'unpaid',
    acceptedAt: raw.acceptedAt ?? null,
    assignedAt: raw.assignedAt ?? null,
    acceptDeadline: raw.acceptDeadline ?? null,
    status: mapTechStatus(raw.status),
    beforePhotosCount: raw.beforePhotosCount ?? 0,
    afterPhotosCount: raw.afterPhotosCount ?? 0,
    workSummarySubmittedAt: raw.workSummarySubmittedAt ?? null,
    otpVerifiedAt: raw.otpVerifiedAt ?? null,
    scopeChange: raw.scopeChange ?? null,
  };
}

export async function fetchTechnicianJobs(): Promise<TodaysJob[]> {
  const res = await api.get<{ data: ApiJob[] }>('/mobile/technician/jobs');
  return res.data.map(toTodaysJob);
}

// Advance a booking through the live status flow. Backend enforces the state machine (409 on
// illegal jumps). Returns the new status string from the server.
export async function updateJobStatus(
  jobId: string,
  next: JobStatus
): Promise<{ id: string; status: string }> {
  return api.post<{ id: string; status: string }>(`/mobile/technician/jobs/${jobId}/status`, {
    status: TO_BACKEND_STATUS[next],
  });
}

// Mark a COD job's cash as collected. Backend rejects (409) if there's no pending cash payment
// for this job, or if it was already collected — collection is permanent (SRS FR-PAY-003).
export async function collectCash(
  jobId: string
): Promise<{ bookingId: string; paymentStatus: string }> {
  return api.post<{ bookingId: string; paymentStatus: string }>(
    `/mobile/technician/jobs/${jobId}/collect-cash`,
    {}
  );
}

// SRS §5.4: Assigned -> Accepted -> En Route. Accepting doesn't change the booking's customer-
// facing status — it just clears the backend gate that blocks the "On my way" (en_route) step.
export async function acceptJob(jobId: string): Promise<{ id: string; acceptedAt: string }> {
  return api.post<{ id: string; acceptedAt: string }>(
    `/mobile/technician/jobs/${jobId}/accept`,
    {}
  );
}

// Declining drops the job back into the vendor's unassigned pool — it disappears from this
// technician's list. Backend rejects (409) once the job has moved past 'assigned'.
export async function declineJob(
  jobId: string,
  reason?: string
): Promise<{ id: string; status: string }> {
  return api.post<{ id: string; status: string }>(`/mobile/technician/jobs/${jobId}/decline`, {
    reason,
  });
}

// ---------------------------------------------------------------------------------------------
// Job-closure gate chain: Before-Photo -> Work Summary -> After-Photo -> Customer OTP
// (SRS §6.1/§6.4, FR-T1-001/003/004/005).
// ---------------------------------------------------------------------------------------------

type PresignResponse = {
  uploadUrl: string;
  method: string;
  headers: Record<string, string>;
  objectKey: string;
  fileUrl: string;
  expiresInSeconds: number;
};

// Reuses the existing shared upload endpoint (api/mobile/routes.py presign_s3_upload) — no
// backend change needed for this. Client PUTs the binary directly to S3 with uploadUrl.
export async function presignPhoto(
  fileExtension: string,
  contentType: string
): Promise<PresignResponse> {
  return api.post<PresignResponse>('/mobile/uploads/presign', {
    kind: 'image',
    fileExtension,
    contentType,
  });
}

// FileSystem.uploadAsync, not fetch — RN's fetch/Response.blob() throws "Creating blobs from
// 'ArrayBuffer' and 'ArrayBufferView' are not supported" when reading a local file:// URI on
// Android, so the binary never reaches S3. uploadAsync streams the file natively instead. Not
// lib/apiClient either — that client is JSON-only and always attaches Zepnest-specific auth/app
// headers that S3 would reject.
export async function uploadPhotoBinary(
  uploadUrl: string,
  headers: Record<string, string>,
  localUri: string
): Promise<void> {
  const result = await FileSystem.uploadAsync(uploadUrl, localUri, {
    httpMethod: 'PUT',
    headers,
    uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
  });
  if (result.status < 200 || result.status >= 300) {
    throw new Error(`Photo upload failed (${result.status})`);
  }
}

export type JobPhotoInput = {
  fileUrl: string;
  latitude: number | null;
  longitude: number | null;
  capturedAt: string | null;
};

export async function submitJobPhotos(
  jobId: string,
  phase: 'before' | 'after',
  photos: JobPhotoInput[]
): Promise<{ beforePhotosCount: number; afterPhotosCount: number }> {
  return api.post<{ beforePhotosCount: number; afterPhotosCount: number }>(
    `/mobile/technician/jobs/${jobId}/photos`,
    { phase, photos }
  );
}

export async function submitWorkSummary(
  jobId: string,
  category: string,
  tasks: string[],
  notes?: string
): Promise<{ workSummarySubmittedAt: string | null }> {
  return api.post<{ workSummarySubmittedAt: string | null }>(
    `/mobile/technician/jobs/${jobId}/work-summary`,
    { category, tasks, notes }
  );
}

export async function requestJobOtp(
  jobId: string
): Promise<{ expiresInSeconds: number; smsSent: boolean; debugOtp?: string }> {
  return api.post<{ expiresInSeconds: number; smsSent: boolean; debugOtp?: string }>(
    `/mobile/technician/jobs/${jobId}/otp/request`,
    {}
  );
}

export async function verifyJobOtp(jobId: string, otp: string): Promise<{ verified: boolean }> {
  return api.post<{ verified: boolean }>(`/mobile/technician/jobs/${jobId}/otp/verify`, { otp });
}

// ---------------------------------------------------------------------------------------------
// Scope Change & Revised Pricing (SRS §9). Raising one pauses closure (backend 409s
// 'completed' while a pending, unexpired scope change exists) until the customer responds
// in lk-app, or the 10-minute window lapses.
// ---------------------------------------------------------------------------------------------

export type ScopeChangeInput = {
  reason: string;
  description: string;
  additionalMinutes?: number;
  additionalAmount: number;
  photoUrl?: string;
};

export async function submitScopeChange(
  jobId: string,
  input: ScopeChangeInput
): Promise<{ id: string; status: string; raisedAt: string; expiresAt: string }> {
  return api.post<{ id: string; status: string; raisedAt: string; expiresAt: string }>(
    `/mobile/technician/jobs/${jobId}/scope-change`,
    input
  );
}
