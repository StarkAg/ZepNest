import { useRouter } from 'expo-router';
import { Phone, RefreshCw } from 'lucide-react-native';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DetailHeader } from '@/src/components/technician/detail/DetailHeader';
import { EarningsSummary } from '@/src/components/technician/detail/EarningsSummary';
import { LiveLocationMap } from '@/src/components/technician/detail/LiveLocationMap';
import { PerformanceGrid } from '@/src/components/technician/detail/PerformanceGrid';
import { ProfileCard } from '@/src/components/technician/detail/ProfileCard';
import { RecentReviews } from '@/src/components/technician/detail/RecentReviews';
import { TodaysSchedule } from '@/src/components/technician/detail/TodaysSchedule';
import { colors } from '@/src/theme/colors';
import type { TechnicianDetail } from '@/src/types/technician';

type TechnicianDetailScreenProps = {
  technician: TechnicianDetail;
  vendorName: string;
  refreshing?: boolean;
  onRefresh?: () => void;
};

export function TechnicianDetailScreen({
  technician,
  vendorName,
  refreshing = false,
  onRefresh,
}: TechnicianDetailScreenProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-surface-app">
      <DetailHeader
        vendorName={vendorName}
        onBack={() => router.back()}
        onCall={() => { /* TODO: initiate call */ }}
        onMore={() => { /* TODO: open action sheet */ }}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> : undefined}
      >
        <ProfileCard technician={technician} />
        <EarningsSummary
          weeklyEarnings={technician.weeklyEarnings}
          monthlyEarnings={technician.monthlyEarnings}
        />
        <PerformanceGrid
          rating={technician.rating}
          ratingDelta={technician.ratingDelta}
          acceptance={technician.acceptance}
          onTimeArrival={technician.onTimeArrival}
          jobsDone={technician.jobsDone}
        />
        <LiveLocationMap
          initials={technician.initials}
          avatarColor={technician.avatarColor}
          address={technician.locationAddress}
          updatedAgo={technician.locationUpdatedAgo}
        />
        <TodaysSchedule
          jobs={technician.todaysSchedule}
          totalJobs={technician.totalJobsToday}
          jobsDone={technician.jobsDoneToday}
        />
        <RecentReviews
          reviews={technician.recentReviews}
          avgRating={technician.rating}
          totalReviews={technician.totalReviews}
        />
      </ScrollView>

      {/* Fixed bottom action bar */}
      <View
        className="flex-row items-center gap-3 px-4 pt-3 bg-surface-card border-t border-zn-border"
        style={{ paddingBottom: insets.bottom + 12 }}
      >
        <Pressable
          className="flex-1 flex-row items-center justify-center gap-2 h-12 rounded-[12px] border border-zn-border bg-surface-card"
          onPress={() => { /* TODO: initiate call */ }}
        >
          <Phone size={18} color={colors.ink[900]} strokeWidth={2} />
          <Text className="text-body-sm font-semibold text-ink-900">Call</Text>
        </Pressable>
        <Pressable
          className="flex-[2] flex-row items-center justify-center gap-2 h-12 rounded-[12px]"
          style={{ backgroundColor: colors.brand.accent }}
          onPress={() => { /* TODO: open reassign flow */ }}
        >
          <RefreshCw size={18} color="#FFFFFF" strokeWidth={2} />
          <Text className="text-body-sm font-semibold text-white">Reassign job</Text>
        </Pressable>
      </View>
    </View>
  );
}
