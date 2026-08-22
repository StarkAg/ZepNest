import { ChevronLeft } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  getNotifications,
  markNotificationRead,
  type VendorNotification,
} from '@/src/services/notifications';
import { useSessionStore } from '@/src/store/sessionStore';
import { colors } from '@/src/theme/colors';

function timeAgo(iso: string | null): string {
  if (!iso) return '';
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function NotificationCard({
  item,
  onPress,
}: {
  item: VendorNotification;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="mx-4 mb-2 flex-row gap-3 rounded-[12px] p-4"
      style={{
        opacity: item.read ? 0.7 : 1,
        borderWidth: item.read ? 1 : 1.5,
        borderColor: item.read ? colors.border.subtle : colors.brand.header,
        backgroundColor: item.read ? colors.surface.card : colors.brand.soft,
      }}>
      <View className="pt-1.5">
        <View
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: item.read ? 'transparent' : colors.brand.header }}
        />
      </View>
      <View className="flex-1">
        <View className="flex-row items-center justify-between gap-2">
          <Text className="flex-1 text-body-sm font-bold text-ink-900">{item.title}</Text>
          <Text className="text-micro text-ink-400">{timeAgo(item.createdAt)}</Text>
        </View>
        <Text className="mt-1 text-label leading-[19px] text-ink-500">{item.body}</Text>
      </View>
    </Pressable>
  );
}

export function NotificationsScreen({
  onBack,
  onOpenJob,
}: {
  onBack: () => void;
  onOpenJob?: (jobId: string) => void;
}) {
  const insets = useSafeAreaInsets();
  const activeRole = useSessionStore((state) => state.activeRole);

  const [items, setItems] = useState<VendorNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const result = await getNotifications(activeRole ?? undefined);
      setItems(result.data);
    } catch {
      // Leave the list as-is on failure — the empty/error state below covers a first-load miss.
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeRole]);

  useEffect(() => {
    void load();
  }, [load]);

  const onPressItem = useCallback(
    async (item: VendorNotification) => {
      if (!item.read) {
        setItems((prev) => prev.map((n) => (n.id === item.id ? { ...n, read: true } : n)));
        try {
          await markNotificationRead(item.id);
        } catch {
          // Optimistic update stands even if the mark-read call fails — next refresh reconciles it.
        }
      }
      // jobId is absent until the backend ships it (see technician-acceptance-window-backend-
      // requirements.md AW2) — falls back to mark-read-only, same as today, until then.
      if (item.jobId) onOpenJob?.(item.jobId);
    },
    [onOpenJob]
  );

  return (
    <View className="flex-1 bg-surface-app">
      <View className="bg-surface-card border-b border-zn-border" style={{ paddingTop: insets.top + 4 }}>
        <View className="flex-row items-center px-1 pb-3" style={{ minHeight: 48 }}>
          <Pressable
            onPress={onBack}
            className="min-w-[48px] min-h-[48px] items-center justify-center"
            accessibilityLabel="Go back"
            accessibilityRole="button">
            <ChevronLeft size={24} color={colors.ink[900]} strokeWidth={2} />
          </Pressable>
          <Text className="flex-1 text-h3 font-bold text-ink-900" numberOfLines={1}>
            Notifications
          </Text>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.brand.header} />
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingTop: 12, paddingBottom: 24 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />}
          showsVerticalScrollIndicator={false}>
          {items.length === 0 ? (
            <Text className="mt-16 self-center text-center text-body text-ink-500">
              No notifications yet
            </Text>
          ) : (
            items.map((item) => (
              <NotificationCard key={item.id} item={item} onPress={() => onPressItem(item)} />
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}
