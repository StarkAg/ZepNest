import { useLocalSearchParams, useRouter } from 'expo-router';

import { ScopeChangeFormScreen } from '@/src/screens/technicianDashboard/ScopeChangeFormScreen';
import { useTechnicianDashboardStore } from '@/src/store/technicianDashboardStore';

export default function ScopeChangeRoute() {
  const router = useRouter();
  const { jobId } = useLocalSearchParams<{ jobId: string }>();
  const job = useTechnicianDashboardStore((state) => state.jobs.find((j) => j.id === jobId));

  if (!job) return null;

  return (
    <ScopeChangeFormScreen
      jobId={jobId}
      jobTypeKey={job.typeKey}
      originalAmount={job.amount}
      onDone={() => router.back()}
      onCancel={() => router.back()}
    />
  );
}
