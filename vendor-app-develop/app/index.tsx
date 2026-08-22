import { Redirect, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { WelcomeScreen } from '@/src/screens/welcome/WelcomeScreen';
import { useSessionStore } from '@/src/store/sessionStore';

export default function HomeScreen() {
  const router = useRouter();
  const isLoading = useSessionStore((state) => state.isLoading);
  const roles = useSessionStore((state) => state.roles);
  const activeRole = useSessionStore((state) => state.activeRole);
  const restoreSession = useSessionStore((state) => state.restoreSession);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator />
      </View>
    );
  }

  if (roles.length > 1 && !activeRole) {
    return <Redirect href="/auth/role-select" />;
  }

  if (roles.length > 0) {
    const role = activeRole ?? roles[0];
    return <Redirect href={role === 'technician' ? '/technician-dashboard' : '/dashboard'} />;
  }

  return <WelcomeScreen onContinueWithMobile={() => router.push('/auth')} />;
}
