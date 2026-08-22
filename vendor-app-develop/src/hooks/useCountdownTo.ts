import { useEffect, useState } from 'react';

function secondsUntil(iso: string | null): number {
  if (!iso) return 0;
  return Math.max(0, Math.round((new Date(iso).getTime() - Date.now()) / 1000));
}

// Unlike useCountdown (fixed duration from mount), this ticks down toward a real server
// timestamp — correct even if the screen is remounted or the app was backgrounded mid-wait.
// Used for the SRS §9 scope-change 10-minute customer approval window.
export function useCountdownTo(expiresAt: string | null) {
  const [secondsLeft, setSecondsLeft] = useState(() => secondsUntil(expiresAt));

  useEffect(() => {
    setSecondsLeft(secondsUntil(expiresAt));
    const interval = setInterval(() => setSecondsLeft(secondsUntil(expiresAt)), 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return secondsLeft;
}
