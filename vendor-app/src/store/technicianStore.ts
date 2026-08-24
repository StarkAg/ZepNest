import { create } from 'zustand';

import { fetchTechnicians } from '@/src/services/technician';
import type { Technician } from '@/src/types/technician';

type TechnicianStore = {
  technicians: Technician[];
  isLoading: boolean;
  error: string | null;
  fetch: () => Promise<void>;
};

export const useTechnicianStore = create<TechnicianStore>((set) => ({
  technicians: [],
  isLoading: false,
  error: null,

  fetch: async () => {
    set({ isLoading: true, error: null });
    try {
      const technicians = await fetchTechnicians();
      set({ technicians, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load technicians';
      set({ error: message, isLoading: false });
    }
  },
}));
