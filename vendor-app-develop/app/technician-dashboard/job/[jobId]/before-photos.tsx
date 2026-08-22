import { useLocalSearchParams, useRouter } from 'expo-router';

import { PhotoCaptureScreen } from '@/src/screens/technicianDashboard/PhotoCaptureScreen';

export default function BeforePhotosRoute() {
  const router = useRouter();
  const { jobId } = useLocalSearchParams<{ jobId: string }>();

  return (
    <PhotoCaptureScreen
      jobId={jobId}
      phase="before"
      onDone={() => router.back()}
      onCancel={() => router.back()}
    />
  );
}
