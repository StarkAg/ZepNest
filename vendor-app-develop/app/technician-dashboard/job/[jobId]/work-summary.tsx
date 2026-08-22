import { useLocalSearchParams, useRouter } from 'expo-router';

import { WorkSummaryScreen } from '@/src/screens/technicianDashboard/WorkSummaryScreen';

export default function WorkSummaryRoute() {
  const router = useRouter();
  const { jobId } = useLocalSearchParams<{ jobId: string }>();

  return (
    <WorkSummaryScreen jobId={jobId} onDone={() => router.back()} onCancel={() => router.back()} />
  );
}
