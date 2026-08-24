import type { TechnicianProfile, TodaysEarnings } from '@/src/types/job';

// Profile + today's earnings are still mock (no technician "me"/earnings endpoint yet);
// today's jobs are now loaded live from GET /mobile/technician/jobs.
export const MOCK_TECHNICIAN_PROFILE: TechnicianProfile = {
  name: 'Ravi Kumar',
  initials: 'RK',
  avatarColor: 'blue',
};

export const MOCK_TODAYS_EARNINGS: TodaysEarnings = {
  amount: 1500,
  jobsDone: 1,
  jobsTotal: 4,
};
