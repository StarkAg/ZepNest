import type { ComponentType } from 'react';

export type DashboardStat = {
  id: string;
  label: string;
  value: string;
  colorKey: 'online' | 'onJob' | 'done';
  Icon: ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
};

export type DashboardTab = {
  key: string;
  label: string;
  badge?: number;
  showStatsRow?: boolean;
  Icon: ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
};
