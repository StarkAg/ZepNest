import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { TechnicianDetailScreen } from '@/src/screens/technician/TechnicianDetailScreen';
import { useTechnicianDetailStore } from '@/src/store/technicianDetailStore';
import { useVendorStore } from '@/src/store/vendorStore';
import { colors } from '@/src/theme/colors';

export default function TechnicianDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { technician, isLoading, error, fetch } = useTechnicianDetailStore();
  const vendor = useVendorStore((state) => state.vendor);

  useEffect(() => {
    if (id) fetch(id);
  }, [fetch, id]);

  if (isLoading && !technician) {
    return (
      <View className="flex-1 items-center justify-center bg-surface-app">
        <ActivityIndicator size="large" color={colors.brand.header} />
      </View>
    );
  }

  if (error || !technician) {
    return (
      <View className="flex-1 items-center justify-center bg-surface-app">
        <Text className="text-body text-ink-500">{error ?? 'Technician not found.'}</Text>
      </View>
    );
  }

  return (
    <TechnicianDetailScreen
      technician={technician}
      vendorName={vendor?.name ?? ''}
      refreshing={isLoading}
      onRefresh={() => id && fetch(id)}
    />
  );
}
