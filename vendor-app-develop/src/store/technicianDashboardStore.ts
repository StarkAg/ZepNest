import { create } from 'zustand';

import { MOCK_TECHNICIAN_PROFILE, MOCK_TODAYS_EARNINGS } from '@/src/data/technicianDashboardMock';
import {
  acceptJob as acceptJobApi,
  collectCash as collectCashApi,
  declineJob as declineJobApi,
  fetchTechnicianJobs,
  presignPhoto,
  requestJobOtp as requestJobOtpApi,
  setOnlineStatus,
  submitJobPhotos as submitJobPhotosApi,
  submitScopeChange as submitScopeChangeApi,
  submitWorkSummary as submitWorkSummaryApi,
  updateJobStatus,
  uploadPhotoBinary,
  verifyJobOtp as verifyJobOtpApi,
  type JobPhotoInput,
  type ScopeChangeInput,
} from '@/src/services/technicianDashboard';
import type { JobStatus, TechnicianProfile, TodaysEarnings, TodaysJob } from '@/src/types/job';

export type CapturedPhoto = {
  localUri: string;
  fileExtension: string;
  contentType: string;
  latitude: number | null;
  longitude: number | null;
  capturedAt: string | null;
};

type TechnicianDashboardStore = {
  profile: TechnicianProfile;
  isOnline: boolean;
  isUpdatingOnlineStatus: boolean;
  earnings: TodaysEarnings;
  jobs: TodaysJob[];
  isLoadingJobs: boolean;
  jobsError: string | null;
  advancingJobId: string | null;
  collectingCashJobId: string | null;
  acceptingJobId: string | null;
  decliningJobId: string | null;
  submittingPhotosJobId: string | null;
  submittingWorkSummaryJobId: string | null;
  requestingOtpJobId: string | null;
  verifyingOtpJobId: string | null;
  otpDebug: string | null;
  otpError: string | null;
  photosError: string | null;
  reportingScopeChangeJobId: string | null;
  scopeChangeError: string | null;
  loadJobs: () => Promise<void>;
  setOnline: (isOnline: boolean) => Promise<void>;
  advanceJob: (jobId: string, next: JobStatus) => Promise<boolean>;
  collectCash: (jobId: string) => Promise<boolean>;
  acceptJob: (jobId: string) => Promise<boolean>;
  declineJob: (jobId: string, reason?: string) => Promise<boolean>;
  submitPhotos: (
    jobId: string,
    phase: 'before' | 'after',
    photos: CapturedPhoto[]
  ) => Promise<boolean>;
  submitWorkSummary: (
    jobId: string,
    category: string,
    tasks: string[],
    notes?: string
  ) => Promise<boolean>;
  requestOtp: (jobId: string) => Promise<boolean>;
  verifyOtp: (jobId: string, otp: string) => Promise<boolean>;
  reportScopeChange: (jobId: string, input: ScopeChangeInput) => Promise<boolean>;
};

export const useTechnicianDashboardStore = create<TechnicianDashboardStore>((set, get) => ({
  profile: MOCK_TECHNICIAN_PROFILE,
  isOnline: true,
  isUpdatingOnlineStatus: false,
  earnings: MOCK_TODAYS_EARNINGS,
  jobs: [],
  isLoadingJobs: false,
  jobsError: null,
  advancingJobId: null,
  collectingCashJobId: null,
  acceptingJobId: null,
  decliningJobId: null,
  submittingPhotosJobId: null,
  submittingWorkSummaryJobId: null,
  requestingOtpJobId: null,
  verifyingOtpJobId: null,
  otpDebug: null,
  otpError: null,
  photosError: null,
  reportingScopeChangeJobId: null,
  scopeChangeError: null,

  loadJobs: async () => {
    set({ isLoadingJobs: true, jobsError: null });
    try {
      const jobs = await fetchTechnicianJobs();
      set({ jobs, isLoadingJobs: false });
    } catch (err) {
      set({
        jobsError: err instanceof Error ? err.message : 'Failed to load jobs',
        isLoadingJobs: false,
      });
    }
  },

  setOnline: async (isOnline) => {
    const previous = get().isOnline;
    set({ isUpdatingOnlineStatus: true, isOnline });
    try {
      await setOnlineStatus(isOnline);
      set({ isUpdatingOnlineStatus: false });
    } catch {
      set({ isOnline: previous, isUpdatingOnlineStatus: false });
    }
  },

  advanceJob: async (jobId, next) => {
    set({ advancingJobId: jobId });
    try {
      await updateJobStatus(jobId, next);
      set({
        advancingJobId: null,
        jobs: get().jobs.map((job) => (job.id === jobId ? { ...job, status: next } : job)),
      });
      return true;
    } catch {
      set({ advancingJobId: null });
      return false;
    }
  },

  collectCash: async (jobId) => {
    set({ collectingCashJobId: jobId });
    try {
      await collectCashApi(jobId);
      set({
        collectingCashJobId: null,
        jobs: get().jobs.map((job) =>
          job.id === jobId ? { ...job, paymentStatus: 'completed', paymentMethod: 'Paid' } : job
        ),
      });
      return true;
    } catch {
      set({ collectingCashJobId: null });
      return false;
    }
  },

  acceptJob: async (jobId) => {
    set({ acceptingJobId: jobId });
    try {
      const res = await acceptJobApi(jobId);
      set({
        acceptingJobId: null,
        jobs: get().jobs.map((job) =>
          job.id === jobId ? { ...job, acceptedAt: res.acceptedAt } : job
        ),
      });
      return true;
    } catch {
      set({ acceptingJobId: null });
      return false;
    }
  },

  declineJob: async (jobId, reason) => {
    set({ decliningJobId: jobId });
    try {
      await declineJobApi(jobId, reason);
      // Declined jobs leave this technician's list entirely — they go back to the vendor's pool.
      set({ decliningJobId: null, jobs: get().jobs.filter((job) => job.id !== jobId) });
      return true;
    } catch {
      set({ decliningJobId: null });
      return false;
    }
  },

  submitPhotos: async (jobId, phase, photos) => {
    set({ submittingPhotosJobId: jobId, photosError: null });
    try {
      const uploaded: JobPhotoInput[] = [];
      for (const photo of photos) {
        const presigned = await presignPhoto(photo.fileExtension, photo.contentType);
        await uploadPhotoBinary(presigned.uploadUrl, presigned.headers, photo.localUri);
        uploaded.push({
          fileUrl: presigned.fileUrl,
          latitude: photo.latitude,
          longitude: photo.longitude,
          capturedAt: photo.capturedAt,
        });
      }
      const res = await submitJobPhotosApi(jobId, phase, uploaded);
      set({
        submittingPhotosJobId: null,
        jobs: get().jobs.map((job) =>
          job.id === jobId
            ? {
                ...job,
                beforePhotosCount: res.beforePhotosCount,
                afterPhotosCount: res.afterPhotosCount,
              }
            : job
        ),
      });
      return true;
    } catch (err) {
      set({
        submittingPhotosJobId: null,
        photosError: err instanceof Error ? err.message : 'Failed to submit photos',
      });
      return false;
    }
  },

  submitWorkSummary: async (jobId, category, tasks, notes) => {
    set({ submittingWorkSummaryJobId: jobId });
    try {
      const res = await submitWorkSummaryApi(jobId, category, tasks, notes);
      set({
        submittingWorkSummaryJobId: null,
        jobs: get().jobs.map((job) =>
          job.id === jobId ? { ...job, workSummarySubmittedAt: res.workSummarySubmittedAt } : job
        ),
      });
      return true;
    } catch {
      set({ submittingWorkSummaryJobId: null });
      return false;
    }
  },

  requestOtp: async (jobId) => {
    set({ requestingOtpJobId: jobId, otpError: null });
    try {
      const res = await requestJobOtpApi(jobId);
      set({ requestingOtpJobId: null, otpDebug: res.debugOtp ?? null });
      return true;
    } catch (err) {
      set({
        requestingOtpJobId: null,
        otpError: err instanceof Error ? err.message : 'Failed to request OTP',
      });
      return false;
    }
  },

  verifyOtp: async (jobId, otp) => {
    set({ verifyingOtpJobId: jobId, otpError: null });
    try {
      await verifyJobOtpApi(jobId, otp);
      set({
        verifyingOtpJobId: null,
        otpDebug: null,
        jobs: get().jobs.map((job) =>
          job.id === jobId ? { ...job, otpVerifiedAt: new Date().toISOString() } : job
        ),
      });
      return true;
    } catch (err) {
      set({
        verifyingOtpJobId: null,
        otpError: err instanceof Error ? err.message : 'Incorrect OTP',
      });
      return false;
    }
  },

  reportScopeChange: async (jobId, input) => {
    set({ reportingScopeChangeJobId: jobId, scopeChangeError: null });
    try {
      const res = await submitScopeChangeApi(jobId, input);
      set({
        reportingScopeChangeJobId: null,
        jobs: get().jobs.map((job) =>
          job.id === jobId
            ? {
                ...job,
                scopeChange: {
                  id: res.id,
                  reason: input.reason,
                  description: input.description,
                  additionalMinutes: input.additionalMinutes ?? null,
                  originalAmount: job.amount,
                  additionalAmount: input.additionalAmount,
                  revisedTotal: job.amount + input.additionalAmount,
                  photoUrl: input.photoUrl ?? null,
                  status: 'pending',
                  raisedAt: res.raisedAt,
                  expiresAt: res.expiresAt,
                },
              }
            : job
        ),
      });
      return true;
    } catch (err) {
      set({
        reportingScopeChangeJobId: null,
        scopeChangeError: err instanceof Error ? err.message : 'Failed to report scope change',
      });
      return false;
    }
  },
}));
