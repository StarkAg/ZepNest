import { ActivityIndicator, FlatList, RefreshControl, Text, View } from 'react-native';

import { colors } from '@/src/theme';
import type { Technician, TechnicianStatus } from '@/src/types/technician';

import { TechnicianCard } from './TechnicianCard';

const STATUS_FILTER_MAP: Record<string, TechnicianStatus[] | null> = {
  all:       null,
  onJob:     ['onJob'],
  available: ['available'],
  off:       ['offDuty', 'offline'],
};

type TechnicianListProps = {
  technicians: Technician[];
  activeFilter: string;
  isLoading: boolean;
  error: string | null;
  onTechnicianPress: (technician: Technician) => void;
  onRefresh: () => void;
};

export function TechnicianList({
  technicians,
  activeFilter,
  isLoading,
  error,
  onTechnicianPress,
  onRefresh,
}: TechnicianListProps) {
  if (isLoading && technicians.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-16">
        <ActivityIndicator size="large" color={colors.brand.header} />
      </View>
    );
  }

  const statusFilter = STATUS_FILTER_MAP[activeFilter] ?? null;
  const filtered = statusFilter
    ? technicians.filter((t) => (statusFilter as TechnicianStatus[]).includes(t.status))
    : technicians;

  return (
    <FlatList
      data={filtered}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TechnicianCard technician={item} onPress={onTechnicianPress} />
      )}
      ListEmptyComponent={
        <View className="flex-1 items-center justify-center py-16">
          <Text className="text-body text-ink-400">{error ?? 'No technicians found'}</Text>
        </View>
      }
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 16, gap: 12, flexGrow: 1 }}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
    />
  );
}
