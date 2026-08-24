import { create } from 'zustand';

import { sendOtp, verifyOtp } from '@/src/services/auth';
import type { AuthRole, VerifyOtpResult } from '@/src/types/auth';

type AuthStore = {
  phone: string;
  roles: AuthRole[];
  isSendingOtp: boolean;
  isVerifyingOtp: boolean;
  error: string | null;
  setPhone: (phone: string) => void;
  sendOtp: () => Promise<boolean>;
  verifyOtp: (code: string) => Promise<VerifyOtpResult | null>;
  clearError: () => void;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  phone: '',
  roles: [],
  isSendingOtp: false,
  isVerifyingOtp: false,
  error: null,

  setPhone: (phone) => set({ phone, error: null }),

  sendOtp: async () => {
    set({ isSendingOtp: true, error: null });
    try {
      await sendOtp(get().phone);
      set({ isSendingOtp: false });
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send OTP';
      set({ isSendingOtp: false, error: message });
      return false;
    }
  },

  verifyOtp: async (code) => {
    set({ isVerifyingOtp: true, error: null });
    try {
      const result = await verifyOtp(get().phone, code);
      set({ isVerifyingOtp: false, roles: result.roles });
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to verify OTP';
      set({ isVerifyingOtp: false, error: message });
      return null;
    }
  },

  clearError: () => set({ error: null }),
}));
