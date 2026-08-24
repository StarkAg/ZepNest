import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRupees(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatDaysAgo(isoDate: string | null): string {
  if (!isoDate) return '';
  const days = Math.floor((Date.now() - new Date(isoDate).getTime()) / 86_400_000);
  if (days <= 0) return 'Today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

export function formatCountdown(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes}:${remaining.toString().padStart(2, '0')}`;
}

export type AcceptanceState = 'pending' | 'expired';

// Whether a job is sitting in the technician-acceptance window, and whether that window has
// lapsed. Returns null when not applicable (job isn't 'assigned', already accepted, or the
// backend hasn't shipped acceptDeadline yet — deliberately never guesses an expiry client-side).
export function getAcceptanceState(job: {
  status: string;
  acceptedAt: string | null;
  acceptDeadline: string | null;
}): AcceptanceState | null {
  if (job.status !== 'assigned' || job.acceptedAt) return null;
  if (!job.acceptDeadline) return 'pending';
  return new Date(job.acceptDeadline).getTime() < Date.now() ? 'expired' : 'pending';
}
