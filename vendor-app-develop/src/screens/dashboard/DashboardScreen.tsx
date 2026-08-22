import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';

import { AppHeader } from '@/src/components/ui/AppHeader';
import { BottomNav } from '@/src/components/ui/BottomNav';
import { ProfileMenuSheet } from '@/src/components/ui/ProfileMenuSheet';
import { StatsRow } from '@/src/components/ui/StatsRow';
import { DASHBOARD_TABS, TAB_TITLES } from '@/src/data/dashboardMock';
import { getNotifications } from '@/src/services/notifications';
import { useDashboardStatsStore } from '@/src/store/dashboardStatsStore';
import { useSessionStore } from '@/src/store/sessionStore';
import { useVendorStore } from '@/src/store/vendorStore';
import type { Technician } from '@/src/types/technician';

import { EarningsTab } from './tabs/EarningsTab';
import { JobsTab } from './tabs/JobsTab';
import { MapTab } from './tabs/MapTab';
import { MyTeamTab } from './tabs/MyTeamTab';
import { MyZoneTab } from './tabs/MyZoneTab';

const STATS_REFRESH_INTERVAL_MS = 30_000;

export function DashboardScreen() {
  const [activeTab, setActiveTab] = useState('myTeam');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const router = useRouter();
  const { vendor, fetch: fetchVendor } = useVendorStore();
  const { stats, fetch: fetchStats } = useDashboardStatsStore();
  const { title, subtitle: mockSubtitle } = TAB_TITLES[activeTab] ?? { title: '', subtitle: '' };
  const subtitle = activeTab === 'myTeam' && vendor ? vendor.name : mockSubtitle;

  const roles = useSessionStore((state) => state.roles);
  const activeRole = useSessionStore((state) => state.activeRole);
  const logout = useSessionStore((state) => state.logout);
  const hasDualRole = roles.length > 1 && activeRole !== null;

  const showStatsRow = DASHBOARD_TABS.find((tab) => tab.key === activeTab)?.showStatsRow ?? true;

  useEffect(() => {
    fetchVendor();
  }, [fetchVendor]);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, STATS_REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchStats]);

  useFocusEffect(
    useCallback(() => {
      const fetchUnreadCount = () => {
        getNotifications('vendor')
          .then((result) => setUnreadCount(result.unreadCount))
          .catch(() => {});
      };
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, STATS_REFRESH_INTERVAL_MS);
      return () => clearInterval(interval);
    }, [])
  );

  function handleNotificationPress() {
    router.push('/notifications');
  }

  function handleTechnicianPress(technician: Technician) {
    router.push(`/technician/${technician.id}`);
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

  function renderActiveTab() {
    switch (activeTab) {
      case 'myTeam':
        return (
          <MyTeamTab
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            onTechnicianPress={handleTechnicianPress}
          />
        );
      case 'map':
        return <MapTab />;
      case 'jobs':
        return <JobsTab />;
      case 'earnings':
        return <EarningsTab />;
      case 'myZone':
        return <MyZoneTab />;
      default:
        return null;
    }
  }

  return (
    <View className="flex-1 bg-surface-app">
      <AppHeader
        title={title}
        subtitle={subtitle}
        notificationCount={unreadCount}
        onNotificationPress={handleNotificationPress}
        onProfilePress={handleProfilePress}
      />
      {showStatsRow && <StatsRow stats={stats} />}
      <View className="flex-1">{renderActiveTab()}</View>
      <BottomNav tabs={DASHBOARD_TABS} activeKey={activeTab} onTabChange={setActiveTab} />

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
