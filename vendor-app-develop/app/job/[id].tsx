import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Text, View } from 'react-native';

import {
  assignJobToTechnician,
  fetchVendorJobDetail,
  fetchVendorTechnicians,
  type VendorTechnicianOption,
} from '@/src/services/jobs';
import { JobDetailScreen } from '@/src/screens/jobs/JobDetailScreen';
import type { JobDetail } from '@/src/types/jobs';

export default function JobDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [job, setJob] = useState<JobDetail | null>(null);
  const [technicians, setTechnicians] = useState<VendorTechnicianOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assigning, setAssigning] = useState(false);

  const load = useCallback(
    async (isRefresh = false) => {
      if (!id) return;
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      try {
        const [detail, techs] = await Promise.all([fetchVendorJobDetail(id), fetchVendorTechnicians()]);
        setJob(detail);
        setTechnicians(techs);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load job');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [id]
  );

  useEffect(() => {
    load();
  }, [load]);

  const handleAssign = useCallback(
    async (technicianId: string) => {
      if (!id) return;
      setAssigning(true);
      try {
        await assignJobToTechnician(id, technicianId);
        await load();
      } catch (e) {
        Alert.alert('Assign failed', e instanceof Error ? e.message : 'Could not assign technician');
      } finally {
        setAssigning(false);
      }
    },
    [id, load]
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-surface-app">
        <ActivityIndicator />
      </View>
    );
  }

  if (error || !job) {
    return (
      <View className="flex-1 items-center justify-center bg-surface-app">
        <Text className="text-body text-ink-500">{error ?? 'Job not found.'}</Text>
      </View>
    );
  }

  return (
    <JobDetailScreen
      job={job}
      technicians={technicians}
      assigning={assigning}
      refreshing={refreshing}
      onRefresh={() => load(true)}
      onAssign={handleAssign}
      onBack={() => router.back()}
    />
  );
}
