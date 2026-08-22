import { create } from 'zustand';

import { fetchVendor } from '@/src/services/vendor';
import type { Vendor } from '@/src/types/vendor';

type VendorStore = {
  vendor: Vendor | null;
  isLoading: boolean;
  error: string | null;
  fetch: () => Promise<void>;
};

export const useVendorStore = create<VendorStore>((set) => ({
  vendor: null,
  isLoading: false,
  error: null,

  fetch: async () => {
    set({ isLoading: true, error: null });
    try {
      const vendor = await fetchVendor();
      set({ vendor, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load vendor';
      set({ error: message, isLoading: false });
    }
  },
}));
