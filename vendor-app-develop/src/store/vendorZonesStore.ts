import { create } from 'zustand';

import { fetchVendorZones } from '@/src/services/vendor';
import type { VendorZones } from '@/src/types/vendor';

type VendorZonesStore = {
  data: VendorZones | null;
  isLoading: boolean;
  error: string | null;
  loadZones: () => Promise<void>;
};

/**
 * The vendor's own coverage — the (pincode × service category) pairs they are contracted for.
 *
 * Read-only: FR-VEND-003 forbids the vendor from changing commission rates or pincode assignments, so
 * there is deliberately no mutation action here.
 */
export const useVendorZonesStore = create<VendorZonesStore>((set) => ({
  data: null,
  isLoading: false,
  error: null,

  loadZones: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchVendorZones();
      set({ data, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load your zones';
      set({ isLoading: false, error: message });
    }
  },
}));
