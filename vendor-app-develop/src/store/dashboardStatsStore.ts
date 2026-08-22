import { CircleCheck, Flag, Wrench } from 'lucide-react-native';
import { create } from 'zustand';

import { fetchCompletedJobsCountToday } from '@/src/services/jobs';
import { fetchTechnicians } from '@/src/services/technician';
import type { DashboardStat } from '@/src/types/dashboard';

type DashboardStatsStore = {
  stats: DashboardStat[];
  isLoading: boolean;
  error: string | null;
  fetch: () => Promise<void>;
};

export const useDashboardStatsStore = create<DashboardStatsStore>((set) => ({
  stats: [],
  isLoading: false,
  error: null,

  fetch: async () => {
    set({ isLoading: true, error: null });
    try {
      const [technicians, done] = await Promise.all([
        fetchTechnicians(),
        fetchCompletedJobsCountToday(),
      ]);
      const online = technicians.filter((t) => t.status !== 'offline').length;
      const onJob = technicians.filter((t) => t.status === 'onJob').length;
      set({
        stats: [
          { id: 'online', label: 'Online', value: String(online), colorKey: 'online', Icon: CircleCheck },
          { id: 'onJob', label: 'On Job', value: String(onJob), colorKey: 'onJob', Icon: Wrench },
          { id: 'done', label: 'Done', value: String(done), colorKey: 'done', Icon: Flag },
        ],
        isLoading: false,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load stats';
      set({ error: message, isLoading: false });
    }
  },
}));
