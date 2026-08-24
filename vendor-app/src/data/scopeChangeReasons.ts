// SRS §9.2 step 2 — Report Scope Change form reason dropdown. Keys must match the backend's
// SCOPE_CHANGE_REASONS set (api/mobile/partner_routes.py).
export const SCOPE_CHANGE_REASONS = [
  { value: 'additional_work_found', label: 'Additional work found' },
  { value: 'job_requires_more_time', label: 'Job requires more time' },
  { value: 'materials_needed', label: 'Materials needed' },
  { value: 'out_of_scope_discovery', label: 'Out of scope discovery' },
  { value: 'other', label: 'Other' },
] as const;

const SCOPE_CHANGE_REASON_LABELS: Record<string, string> = Object.fromEntries(
  SCOPE_CHANGE_REASONS.map((r) => [r.value, r.label])
);

export function scopeChangeReasonLabel(reason: string): string {
  return SCOPE_CHANGE_REASON_LABELS[reason] ?? reason;
}

// SRS §9.2 step 2 — additional time options (Type 1 / rate-card jobs only).
export const SCOPE_CHANGE_TIME_OPTIONS = [30, 60, 90] as const;
