import { useFocusEffect, useRouter } from 'expo-router';
import { Navigation } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActiveJobBanner } from '@/src/components/technicianDashboard/ActiveJobBanner';
import { EarningsCard } from '@/src/components/technicianDashboard/EarningsCard';
import { GoOfflineSheet } from '@/src/components/technicianDashboard/GoOfflineSheet';
import { JobCard } from '@/src/components/technicianDashboard/JobCard';
import { TechnicianHomeHeader } from '@/src/components/technicianDashboard/TechnicianHomeHeader';
import { ProfileMenuSheet } from '@/src/components/ui/ProfileMenuSheet';
import { getNotifications } from '@/src/services/notifications';
import { useSessionStore } from '@/src/store/sessionStore';
import { useTechnicianDashboardStore } from '@/src/store/technicianDashboardStore';
import { colors } from '@/src/theme/colors';

const NOTIFICATIONS_POLL_INTERVAL_MS = 30_000;

export function TechnicianDashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const profileMock = useTechnicianDashboardStore((state) => state.profile);
  const isOnline = useTechnicianDashboardStore((state) => state.isOnline);
  const isUpdatingOnlineStatus = useTechnicianDashboardStore(
    (state) => state.isUpdatingOnlineStatus
  );
  const earnings = useTechnicianDashboardStore((state) => state.earnings);
  const jobs = useTechnicianDashboardStore((state) => state.jobs);
  const isLoadingJobs = useTechnicianDashboardStore((state) => state.isLoadingJobs);
  const setOnline = useTechnicianDashboardStore((state) => state.setOnline);
  const loadJobs = useTechnicianDashboardStore((state) => state.loadJobs);

  const [showOfflineSheet, setShowOfflineSheet] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  useFocusEffect(
    useCallback(() => {
      const fetchUnreadCount = () => {
        getNotifications('technician')
          .then((result) => setUnreadCount(result.unreadCount))
          .catch(() => {});
      };
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, NOTIFICATIONS_POLL_INTERVAL_MS);
      return () => clearInterval(interval);
    }, [])
  );

  const roles = useSessionStore((state) => state.roles);
  const activeRole = useSessionStore((state) => state.activeRole);
  const sessionUser = useSessionStore((state) => state.user);
  const logout = useSessionStore((state) => state.logout);
  const hasDualRole = roles.length > 1 && activeRole !== null;

  // Use the logged-in technician's identity for the header; fall back to the placeholder avatar color.
  const profile = sessionUser
    ? { name: sessionUser.name, initials: sessionUser.initials, avatarColor: profileMock.avatarColor }
    : profileMock;

  const activeJob = jobs.find(
    (job) => job.status === 'enRoute' || job.status === 'arrived' || job.status === 'inProgress'
  );
  const canNavigateToActiveJob = activeJob?.status === 'enRoute';

  function handleToggleOnline(value: boolean) {
    if (!value) {
      setShowOfflineSheet(true);
      return;
    }
    setOnline(true);
  }

  function handleConfirmOffline() {
    setShowOfflineSheet(false);
    setOnline(false);
  }

  function handleProfilePress() {
    setShowProfileMenu(true);
  }

  function handleSwitchRole() {
    setShowProfileMenu(false);
    router.push('/auth/role-select');
  }

  async function handleLogout() {
    setShowProfileMenu(false);
    await logout();
    router.replace('/');
  }

  function handleNotificationPress() {
    router.push('/notifications');
  }

  return (
    <View className="flex-1 bg-surface-app">
      <TechnicianHomeHeader
        name={profile.name}
        initials={profile.initials}
        avatarColor={profile.avatarColor}
        isOnline={isOnline}
        isUpdatingOnlineStatus={isUpdatingOnlineStatus}
        notificationCount={unreadCount}
        onToggleOnline={handleToggleOnline}
        onNotificationPress={handleNotificationPress}
        onProfilePress={handleProfilePress}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoadingJobs && jobs.length > 0} onRefresh={loadJobs} />}>
        {activeJob ? <ActiveJobBanner job={activeJob} /> : null}
        <EarningsCard earnings={earnings} />

        <View className="mx-4 mt-5 gap-2">
          <Text
            className="text-micro font-bold uppercase text-ink-500"
            style={{ letterSpacing: 0.8 }}>
            Today&apos;s Jobs
          </Text>
          <View className="gap-2">
            {isLoadingJobs && jobs.length === 0 ? (
              <View className="items-center py-8">
                <ActivityIndicator />
              </View>
            ) : jobs.length === 0 ? (
              <Text className="py-8 text-center text-body-sm text-ink-400">No jobs assigned to you yet.</Text>
            ) : (
              jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onPress={() => router.push({ pathname: '/technician-dashboard/job/[jobId]', params: { jobId: job.id } })}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {canNavigateToActiveJob ? (
        <View
          className="border-t border-zn-border bg-surface-card px-4 pt-3"
          style={{ paddingBottom: insets.bottom + 12 }}>
          <Pressable
            onPress={() => {
              /* TODO: open maps navigation to job location */
            }}
            accessibilityRole="button"
            className="h-12 flex-row items-center justify-center gap-2 rounded-xl"
            style={{ backgroundColor: colors.brand.header }}>
            <Navigation size={18} color="#FFFFFF" strokeWidth={2} />
            <Text className="text-body font-bold text-white">Navigate to active job</Text>
          </Pressable>
        </View>
      ) : null}

      <GoOfflineSheet
        visible={showOfflineSheet}
        onCancel={() => setShowOfflineSheet(false)}
        onConfirm={handleConfirmOffline}
      />

      {activeRole ? (
        <ProfileMenuSheet
          visible={showProfileMenu}
          activeRole={activeRole}
          otherRole={hasDualRole ? (activeRole === 'vendor' ? 'technician' : 'vendor') : undefined}
          onClose={() => setShowProfileMenu(false)}
          onSwitchRole={hasDualRole ? handleSwitchRole : undefined}
          onLogout={handleLogout}
        />
      ) : null}
    </View>
  );
}
