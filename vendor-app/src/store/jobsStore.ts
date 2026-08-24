import { create } from 'zustand';

import { fetchVendorJobs } from '@/src/services/jobs';
import type { Job, JobPeriod } from '@/src/types/jobs';

type JobsStore = {
  jobs: Job[];
  isLoading: boolean;
  error: string | null;
  loadedPeriod: JobPeriod | null;
  loadJobs: (period: JobPeriod) => Promise<void>;
};

export const useJobsStore = create<JobsStore>((set) => ({
  jobs: [],
  isLoading: false,
  error: null,
  loadedPeriod: null,

  loadJobs: async (period) => {
    set({ isLoading: true, error: null });
    try {
      const jobs = await fetchVendorJobs(period);
      set({ jobs, isLoading: false, loadedPeriod: period });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load jobs';
      set({ isLoading: false, error: message });
    }
  },
}));
