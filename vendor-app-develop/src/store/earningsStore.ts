import { create } from 'zustand';

import { fetchVendorEarnings, type VendorEarnings } from '@/src/services/earnings';

type EarningsStore = {
  data: VendorEarnings | null;
  isLoading: boolean;
  error: string | null;
  loadEarnings: (period: 'thisWeek' | 'thisMonth') => Promise<void>;
};

export const useEarningsStore = create<EarningsStore>((set) => ({
  data: null,
  isLoading: false,
  error: null,

  loadEarnings: async (period) => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchVendorEarnings(period);
      set({ data, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load earnings';
      set({ isLoading: false, error: message });
    }
  },
}));
