import { ClipboardList, Map, MapPin, Users, Wallet } from 'lucide-react-native';

import type { DashboardTab } from '@/src/types/dashboard';

export const DASHBOARD_TABS: DashboardTab[] = [
  { key: 'myTeam', label: 'Team', Icon: Users },
  { key: 'map', label: 'Map', Icon: Map },
  { key: 'jobs', label: 'Jobs', badge: 3, Icon: ClipboardList },
  { key: 'earnings', label: 'Earnings', showStatsRow: false, Icon: Wallet },
  // Read-only coverage view (Admin SRS §12.6). No stats row: the dashboard stats are job/technician
  // counts, which say nothing about which pincode+category pairs this vendor is contracted for.
  { key: 'myZone', label: 'My Zone', showStatsRow: false, Icon: MapPin },
];

export const TEAM_FILTER_OPTIONS: Array<{ key: string; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'onJob', label: 'On Job' },
  { key: 'available', label: 'Available' },
  { key: 'off', label: 'Off' },
];

export const MOCK_VENDOR_HEADER = {
  name: 'Surya Enterprises',
  zone: 'Bengaluru South',
  notificationCount: 2,
};

export const TAB_TITLES: Record<string, { title: string; subtitle: string }> = {
  myZone: { title: 'My Zone', subtitle: 'Pincodes and service categories you cover' },
  myTeam: { title: 'My Team', subtitle: 'Surya Enterprises · Bengaluru South' },
  map: { title: 'Live Map', subtitle: '6 technicians live' },
  jobs: { title: 'Jobs', subtitle: '12 today' },
  earnings: { title: 'Earnings', subtitle: 'Surya Enterprises · 47 jobs settled' },
};
