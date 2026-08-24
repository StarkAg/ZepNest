import { platformStorage } from '@/lib/platformStorage';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? '';
const TOKEN_KEY = 'auth_token';

async function getToken(): Promise<string | null> {
  try {
    return await Promise.race([
      platformStorage.get(TOKEN_KEY),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000)),
    ]);
  } catch {
    return null;
  }
}

// Exposed for the session store's app-launch bootstrap check.
export const getAccessToken = getToken;

export async function clearAccessToken(): Promise<void> {
  await platformStorage.remove(TOKEN_KEY);
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getToken();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'bypass-tunnel-reminder': 'true',
        'X-App-Client': 'vendor-app',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init?.headers,
      },
    });
    clearTimeout(timeout);
    const body = await res.json().catch(() => null);
    if (!res.ok) {
      const message =
        body && typeof body === 'object' && 'message' in body
          ? String((body as { message: unknown }).message)
          : `${res.status} ${res.statusText}`;
      throw new Error(message);
    }
    return body as T;
  } catch (err) {
    clearTimeout(timeout);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Request timed out. Check your connection and try again.');
    }
    throw err;
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
