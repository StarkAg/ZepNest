// Predefined Work Summary task checklist (SRS §6.2, Job Type 1 — Electrical/Plumbing).
// "Other (free text)" is a UI-level input, not a list entry.

export const ELECTRICAL_TASKS = [
  'Fan installation / replacement',
  'Light fitting / bulb replacement',
  'Switch / socket replacement',
  'MCB / circuit breaker replacement',
  'Fan regulator fitting',
  'Doorbell installation',
  'Extension board fitting',
  'Earthing check and repair',
  'Wiring inspection and repair',
  'DB box work',
];

export const PLUMBING_TASKS = [
  'Tap / faucet repair or replacement',
  'Pipe leak repair',
  'Drain / sink unclog',
  'Toilet flush repair',
  'Shower / mixer fitting',
  'Water tank valve repair',
  'Geyser connection check',
  'Water pressure issue fix',
  'Concealed pipe inspection',
];

export type WorkSummaryCategory = 'electrical' | 'plumbing' | 'other';

export const WORK_SUMMARY_CATEGORIES: {
  key: WorkSummaryCategory;
  label: string;
  tasks: string[];
}[] = [
  { key: 'electrical', label: 'Electrical', tasks: ELECTRICAL_TASKS },
  { key: 'plumbing', label: 'Plumbing', tasks: PLUMBING_TASKS },
  { key: 'other', label: 'Other', tasks: [] },
];
