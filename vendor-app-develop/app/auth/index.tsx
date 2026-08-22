import { useRouter } from 'expo-router';

import { LoginScreen } from '@/src/screens/auth/LoginScreen';

export default function LoginRoute() {
  const router = useRouter();

  return <LoginScreen onOtpSent={() => router.push('/auth/otp')} />;
}
