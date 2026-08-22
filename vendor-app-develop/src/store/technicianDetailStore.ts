import { create } from 'zustand';

import { fetchTechnicianDetail } from '@/src/services/technician';
import type { TechnicianDetail } from '@/src/types/technician';

type TechnicianDetailStore = {
  technician: TechnicianDetail | null;
  isLoading: boolean;
  error: string | null;
  fetch: (id: string) => Promise<void>;
};

export const useTechnicianDetailStore = create<TechnicianDetailStore>((set) => ({
  technician: null,
  isLoading: false,
  error: null,

  fetch: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const technician = await fetchTechnicianDetail(id);
      set({ technician, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load technician';
      set({ error: message, isLoading: false });
    }
  },
}));
