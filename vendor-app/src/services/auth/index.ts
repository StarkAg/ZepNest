import { api } from '@/lib/apiClient';
import { platformStorage } from '@/lib/platformStorage';
import type { RequestOtpResponse, VerifyOtpResult } from '@/src/types/auth';

export async function sendOtp(phone: string): Promise<void> {
  await api.post<RequestOtpResponse>('/mobile/auth/request-otp', { phone });
}

export async function verifyOtp(phone: string, otp: string): Promise<VerifyOtpResult> {
  const result = await api.post<VerifyOtpResult>('/mobile/auth/verify-otp', { phone, otp });
  await platformStorage.set('auth_token', result.accessToken);
  return result;
}
