'use client';

import { useMemo } from 'react';
import { Home, CalendarDays, Building2, Tag, type LucideIcon } from 'lucide-react';
import { liquidGlassFilter } from '@/lib/liquidGlass';
import { cn } from '@/lib/cn';

export type NavId = 'home' | 'bookings' | 'property' | 'offers';

type NavItem = { id: NavId; label: string; Icon: LucideIcon; disabled?: boolean };

const ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'bookings', label: 'Bookings', Icon: CalendarDays },
  { id: 'property', label: 'Property', Icon: Building2 },
  { id: 'offers', label: 'Offers', Icon: Tag },
];

export function BottomNav({
  active = 'home',
  onNav,
}: {
  active?: NavId;
  onNav?: (id: NavId) => void;
}) {
  // The filter string is expensive to build and never changes - memoize it.
  const backdrop = useMemo(() => {
    const url = liquidGlassFilter({
      height: 64,
      width: 320,
      radius: 28,
      depth: 10,
      strength: 50,
      chromaticAberration: 3,
    });
    return `blur(2.5px) url('${url}') blur(5px) brightness(1.08) saturate(1.6)`;
  }, []);

  return (
    <nav
      aria-label="Primary"
      className="absolute bottom-4 left-3.5 right-3.5 z-100 flex rounded-[28px] border border-white/65 px-1.5 py-2.5"
      style={{
        background: 'rgba(255,255,255,0.42)',
        backdropFilter: backdrop,
        WebkitBackdropFilter: backdrop,
        boxShadow:
          '0 16px 36px rgba(0,0,0,0.16), 0 2px 10px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
      }}
    >
      {ITEMS.map(({ id, label, Icon, disabled }) => {
        const isActive = active === id;
        const color = disabled
          ? 'rgba(20,20,20,0.22)'
          : isActive
            ? 'var(--color-text)'
            : 'rgba(20,20,20,0.45)';

        return (
          <button
            key={id}
            type="button"
            disabled={disabled}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => !disabled && onNav?.(id)}
            className={cn(
              'flex flex-1 flex-col items-center gap-1 bg-transparent',
              disabled ? 'cursor-default opacity-40' : 'cursor-pointer',
            )}
          >
            <Icon size={20} color={color} strokeWidth={isActive ? 2.2 : 1.8} />
            <span className="text-[9.5px] font-semibold" style={{ color }}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
