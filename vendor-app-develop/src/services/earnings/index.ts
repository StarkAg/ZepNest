import { api } from '@/lib/apiClient';
import type { AvatarColor } from '@/src/theme';
import type { BreakdownItem, NetPayoutData, TechnicianEarning } from '@/src/types/earnings';

const AVATAR_COLOR_PALETTE: AvatarColor[] = ['teal', 'purple', 'green', 'blue', 'amber', 'red'];

function resolveAvatarColor(id: string): AvatarColor {
  return AVATAR_COLOR_PALETTE[Math.abs(parseInt(id, 10) || 0) % AVATAR_COLOR_PALETTE.length];
}

function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || 'NA';
}

type ApiEarningsTech = {
  technicianId: string;
  technicianName: string;
  jobs: number;
  gross: number;
  net: number;
};

type ApiEarnings = {
  period: string;
  grossRevenue: number;
  platformFee: number;
  netPayout: number;
  completedJobs: number;
  perTechnician: ApiEarningsTech[];
};

export type VendorEarnings = {
  netPayout: NetPayoutData;
  breakdown: BreakdownItem[];
  technicians: TechnicianEarning[];
};

const PERIOD_PARAM: Record<string, string> = { thisWeek: 'week', thisMonth: 'month' };

export async function fetchVendorEarnings(period: 'thisWeek' | 'thisMonth'): Promise<VendorEarnings> {
  const raw = await api.get<ApiEarnings>(`/mobile/vendor/earnings?period=${PERIOD_PARAM[period] ?? 'week'}`);

  const netPayout: NetPayoutData = {
    label: period === 'thisMonth' ? 'This Month' : 'This Week',
    settlementStatus: 'pending',
    netPayout: raw.netPayout,
    grossRevenue: raw.grossRevenue,
    nextPayoutLabel: `${raw.completedJobs} completed job${raw.completedJobs === 1 ? '' : 's'}`,
  };

  const breakdown: BreakdownItem[] = [
    { id: 'gross', icon: 'rupee', label: 'Gross revenue', sublabel: 'Customer payments', amount: raw.grossRevenue, variant: 'neutral' },
    { id: 'fee', icon: 'percent', label: 'Platform fee', sublabel: 'ZepNest share (15%)', amount: -raw.platformFee, variant: 'deduction' },
    { id: 'net', icon: 'trending', label: 'Net payout', sublabel: 'Settled to you', amount: raw.netPayout, variant: 'addition' },
  ];

  const totalGross = raw.perTechnician.reduce((sum, t) => sum + t.gross, 0) || 1;
  const technicians: TechnicianEarning[] = raw.perTechnician.map((t) => ({
    id: t.technicianId,
    initials: initialsFrom(t.technicianName),
    avatarColor: resolveAvatarColor(t.technicianId),
    name: t.technicianName || 'Technician',
    specialties: '',
    jobsDone: t.jobs,
    percent: Math.round((t.gross / totalGross) * 100),
    grossAmount: t.gross,
    netAmount: t.net,
    platformFee: Math.round((t.gross - t.net) * 100) / 100,
    avgPerJob: t.jobs ? Math.round((t.gross / t.jobs) * 100) / 100 : 0,
  }));

  return { netPayout, breakdown, technicians };
}
