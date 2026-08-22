import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { JobDetailScreen } from '@/src/screens/technicianDashboard/JobDetailScreen';
import { useTechnicianDashboardStore } from '@/src/store/technicianDashboardStore';

export default function JobDetailRoute() {
  const router = useRouter();
  const { jobId } = useLocalSearchParams<{ jobId: string }>();
  const job = useTechnicianDashboardStore((state) => state.jobs.find((j) => j.id === jobId));
  const loadJobs = useTechnicianDashboardStore((state) => state.loadJobs);
  const isLoadingJobs = useTechnicianDashboardStore((state) => state.isLoadingJobs);

  // Refetch on every mount, not just when the store is empty — this is what makes a reload (or
  // simply reopening this screen) pick up backend changes like payment settling mid-job, and
  // it's what repopulates the store at all after a dev reload resets it to jobs: [].
  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  if (!job) {
    return (
      <View className="flex-1 items-center justify-center bg-surface-app">
        {isLoadingJobs ? (
          <ActivityIndicator />
        ) : (
          <Text className="text-body text-ink-500">Job not found.</Text>
        )}
      </View>
    );
  }

  return (
    <JobDetailScreen
      job={job}
      onBack={() => router.back()}
      onOpenBeforePhotos={() => router.push(`/technician-dashboard/job/${jobId}/before-photos`)}
      onOpenAfterPhotos={() => router.push(`/technician-dashboard/job/${jobId}/after-photos`)}
      onOpenWorkSummary={() => router.push(`/technician-dashboard/job/${jobId}/work-summary`)}
      onOpenScopeChange={() => router.push(`/technician-dashboard/job/${jobId}/scope-change`)}
    />
  );
}
