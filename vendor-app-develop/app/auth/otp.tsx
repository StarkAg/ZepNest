import { useRouter } from 'expo-router';

import { OtpScreen } from '@/src/screens/auth/OtpScreen';
import { useSessionStore } from '@/src/store/sessionStore';
import type { AuthRole, VerifyOtpResult } from '@/src/types/auth';

function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || 'NA';
}

export default function OtpRoute() {
  const router = useRouter();
  const setRoles = useSessionStore((state) => state.setRoles);
  const setActiveRole = useSessionStore((state) => state.setActiveRole);
  const setUser = useSessionStore((state) => state.setUser);

  function handleVerified(roles: AuthRole[], user: VerifyOtpResult['user']) {
    setRoles(roles);
    const name = `${user.firstName} ${user.lastName}`.trim() || 'Partner';
    setUser({ id: user.id, name, initials: initialsFrom(name) });

    if (roles.length > 1) {
      router.replace('/auth/role-select');
      return;
    }

    setActiveRole(roles[0]);
    router.replace(roles[0] === 'technician' ? '/technician-dashboard' : '/dashboard');
  }

  return (
    <OtpScreen
      onBack={() => router.back()}
      onEdit={() => router.back()}
      onVerified={handleVerified}
    />
  );
}
