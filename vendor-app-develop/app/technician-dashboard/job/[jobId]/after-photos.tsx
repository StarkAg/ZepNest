import { useLocalSearchParams, useRouter } from 'expo-router';

import { PhotoCaptureScreen } from '@/src/screens/technicianDashboard/PhotoCaptureScreen';

export default function AfterPhotosRoute() {
  const router = useRouter();
  const { jobId } = useLocalSearchParams<{ jobId: string }>();

  return (
    <PhotoCaptureScreen
      jobId={jobId}
      phase="after"
      onDone={() => router.back()}
      onCancel={() => router.back()}
    />
  );
}
