import { useEffect, useState } from 'react';
import { Download } from 'lucide-react-native';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useEarningsStore } from '@/src/store/earningsStore';

import { CustomDateSheet } from '@/src/components/earnings/CustomDateSheet';
import { EarningsBarChart } from '@/src/components/earnings/EarningsBarChart';
import { JobSettlementSheet } from '@/src/components/earnings/JobSettlementSheet';
import { JobTypeBreakdown } from '@/src/components/earnings/JobTypeBreakdown';
import { NetPayoutCard } from '@/src/components/earnings/NetPayoutCard';
import { PerJobSettlement } from '@/src/components/earnings/PerJobSettlement';
import { SettlementBreakdown } from '@/src/components/earnings/SettlementBreakdown';
import { TechnicianEarningsList } from '@/src/components/earnings/TechnicianEarningsList';
import { TechnicianEarningsSheet } from '@/src/components/earnings/TechnicianEarningsSheet';
import {
  MOCK_BREAKDOWN_MONTH,
  MOCK_BREAKDOWN_WEEK,
  MOCK_JOB_SETTLEMENTS,
  MOCK_JOB_TYPES,
  MOCK_NET_PAYOUT_MONTH,
  MOCK_NET_PAYOUT_WEEK,
  MOCK_TECHNICIAN_EARNINGS,
  MOCK_WEEK_BARS,
} from '@/src/data/earningsMock';
import { colors } from '@/src/theme/colors';
import type { EarningsPeriod, JobSettlement, TechnicianEarning } from '@/src/types/earnings';

const PERIOD_TABS: Array<{ key: EarningsPeriod; label: string }> = [
  { key: 'thisWeek',  label: 'This Week'  },
  { key: 'thisMonth', label: 'This Month' },
  { key: 'custom',    label: 'Custom'     },
];

function PeriodSelector({
  active,
  onSelect,
}: {
  active: EarningsPeriod;
  onSelect: (p: EarningsPeriod) => void;
}) {
  return (
    <View className="mx-4 my-3 flex-row rounded-[10px] p-1" style={{ backgroundColor: colors.surface.sunken }}>
      {PERIOD_TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onSelect(tab.key)}
            className="flex-1 py-2 items-center rounded-[8px]"
            style={isActive ? { backgroundColor: colors.surface.card } : undefined}
          >
            <Text
              className="text-body-sm"
              style={{
                fontWeight: isActive ? '700' : '500',
                color: isActive ? colors.ink[900] : colors.ink[500],
              }}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function EarningsTab() {
  const [period, setPeriod] = useState<EarningsPeriod>('thisWeek');
  const [customSheetOpen, setCustomSheetOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobSettlement | null>(null);
  const [selectedTech, setSelectedTech] = useState<TechnicianEarning | null>(null);

  const insets = useSafeAreaInsets();

  // Live data for net payout / settlement breakdown / per-technician earnings (GET /mobile/vendor/earnings).
  // Bar chart, job-type breakdown and per-job settlements stay on mock until the backend exposes them.
  const { data: liveEarnings, isLoading, loadEarnings } = useEarningsStore();
  useEffect(() => {
    if (period !== 'custom') loadEarnings(period);
  }, [period, loadEarnings]);

  const netPayout = liveEarnings?.netPayout ?? (period === 'thisMonth' ? MOCK_NET_PAYOUT_MONTH : MOCK_NET_PAYOUT_WEEK);
  const breakdown = liveEarnings?.breakdown ?? (period === 'thisMonth' ? MOCK_BREAKDOWN_MONTH : MOCK_BREAKDOWN_WEEK);
  const technicianEarnings = liveEarnings?.technicians ?? MOCK_TECHNICIAN_EARNINGS;

  function handlePeriodSelect(p: EarningsPeriod) {
    if (p === 'custom') {
      setCustomSheetOpen(true);
    } else {
      setPeriod(p);
    }
  }

  return (
    <View className="flex-1 bg-surface-app">
      <PeriodSelector active={period} onSelect={handlePeriodSelect} />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={period !== 'custom' && isLoading}
            onRefresh={() => period !== 'custom' && loadEarnings(period)}
          />
        }
      >
        <NetPayoutCard data={netPayout} />
        <SettlementBreakdown items={breakdown} />
        <EarningsBarChart bars={MOCK_WEEK_BARS} />
        <JobTypeBreakdown items={MOCK_JOB_TYPES} />
        <TechnicianEarningsList items={technicianEarnings} onPress={setSelectedTech} />
        <PerJobSettlement jobs={MOCK_JOB_SETTLEMENTS} onPress={setSelectedJob} />
      </ScrollView>

      <View
        className="px-4 pt-3 bg-surface-app border-t border-zn-border"
        style={{ paddingBottom: Math.max(insets.bottom, 8) + 8 }}
      >
        <Pressable
          className="flex-row items-center justify-center gap-2 rounded-[12px] active:opacity-80"
          style={{ backgroundColor: colors.brand.header, height: 52 }}
        >
          <Download size={18} color="#fff" />
          <Text className="text-title font-bold text-white">Download settlement statement</Text>
        </Pressable>
      </View>

      <CustomDateSheet
        visible={customSheetOpen}
        onClose={() => setCustomSheetOpen(false)}
        onApply={() => { setPeriod('custom'); setCustomSheetOpen(false); }}
      />
      <JobSettlementSheet
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        onViewDetail={() => {/* TODO: navigate to job detail once earnings jobs map to real job records */}}
      />
      <TechnicianEarningsSheet
        technician={selectedTech}
        onClose={() => setSelectedTech(null)}
      />
    </View>
  );
}
