import { useRouter } from 'expo-router';

import { NotificationsScreen } from '@/src/screens/notifications/NotificationsScreen';

export default function NotificationsRoute() {
  const router = useRouter();
  return (
    <NotificationsScreen
      onBack={() => router.back()}
      onOpenJob={(jobId) => router.push(`/job/${jobId}`)}
    />
  );
}
