import { useRouter } from 'expo-router';

import { RoleSelectScreen } from '@/src/screens/auth/RoleSelectScreen';
import { useSessionStore } from '@/src/store/sessionStore';
import type { AuthRole } from '@/src/types/auth';

export default function RoleSelectRoute() {
  const router = useRouter();
  const setActiveRole = useSessionStore((state) => state.setActiveRole);

  function handleSelectRole(role: AuthRole) {
    setActiveRole(role);
    router.replace(role === 'technician' ? '/technician-dashboard' : '/dashboard');
  }

  return <RoleSelectScreen onSelectRole={handleSelectRole} />;
}
