'use client';

import { useState } from 'react';
import { BottomNav, type NavId } from '@/components/ui/BottomNav';

export default function HomePage() {
  const [tab, setTab] = useState<NavId>('home');

  return (
    <main className="relative mx-auto h-dvh max-w-[440px] overflow-hidden bg-bg">
      <div className="safe-top h-full overflow-y-auto px-4 pb-28 pt-4">
        <h1 className="text-2xl font-extrabold tracking-tight text-text">Zepnest</h1>
        <p className="mt-1 text-sm text-text-sec">Home services, on demand.</p>

        {/* Scaffold placeholder: enough surface for the glass nav to refract. */}
        <div className="mt-5 space-y-3">
          {['Electrician', 'Plumber', 'AC Repair', 'Deep Cleaning', 'Salon at Home', 'Painting'].map(
            (name) => (
              <div
                key={name}
                className="rounded-2xl border border-border bg-surface p-4 shadow-sm"
              >
                <p className="font-semibold text-text">{name}</p>
                <p className="mt-0.5 text-xs text-text-sec">Starting at ₹249 · 4.8 ★</p>
              </div>
            ),
          )}
          <div className="h-40 rounded-2xl bg-gradient-to-br from-accent to-accent/40" />
        </div>
      </div>

      <BottomNav active={tab} onNav={setTab} />
    </main>
  );
}
