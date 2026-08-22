import { platformStorage } from '@/lib/platformStorage';
import type { SessionUser } from '@/src/store/sessionStore';
import type { AuthRole } from '@/src/types/auth';

const SESSION_KEY = 'auth_session';

export type StoredSession = {
  roles: AuthRole[];
  activeRole: AuthRole | null;
  user: SessionUser;
};

export async function saveSession(session: StoredSession): Promise<void> {
  await platformStorage.set(SESSION_KEY, JSON.stringify(session));
}

export async function loadSession(): Promise<StoredSession | null> {
  try {
    const raw = await platformStorage.get(SESSION_KEY);
    return raw ? (JSON.parse(raw) as StoredSession) : null;
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  await platformStorage.remove(SESSION_KEY);
}
