import { useState } from 'react';
import { ArrowLeftRight, BellDot } from 'lucide-react-native';
import { ActivityIndicator, Modal, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CustomerRatingCard } from '@/src/components/jobs/detail/CustomerRatingCard';
import { JobDetailHeader } from '@/src/components/jobs/detail/JobDetailHeader';
import { JobInfoCard } from '@/src/components/jobs/detail/JobInfoCard';
import { JobPhotos } from '@/src/components/jobs/detail/JobPhotos';
import { PaymentRow } from '@/src/components/jobs/detail/PaymentRow';
import { ScopeChangeCard } from '@/src/components/jobs/detail/ScopeChangeCard';
import { StatusLog } from '@/src/components/jobs/detail/StatusLog';
import type { VendorTechnicianOption } from '@/src/services/jobs';
import { colors } from '@/src/theme/colors';
import type { JobDetail } from '@/src/types/jobs';

type JobDetailScreenProps = {
  job: JobDetail;
  technicians?: VendorTechnicianOption[];
  assigning?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  onAssign?: (technicianId: string) => void;
  onBack: () => void;
};

export function JobDetailScreen({
  job,
  technicians = [],
  assigning = false,
  refreshing = false,
  onRefresh,
  onAssign,
  onBack,
}: JobDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const [pickerOpen, setPickerOpen] = useState(false);

  const isUnassigned = job.technician.name === 'Unassigned';
  // Reassign is only allowed before the technician is en route (backend enforces this too).
  const canAssign = isUnassigned || job.jobStatus === 'assigned';
  const assignLabel = isUnassigned ? 'Assign technician' : 'Reassign technician';

  return (
    <View className="flex-1 bg-surface-app">
      <JobDetailHeader
        jobNumber={job.jobNumber}
        jobStatus={job.jobStatus}
        onBack={onBack}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> : undefined}
      >
        <JobInfoCard
          job={job}
          onCallTechnician={() => {}}
        />

        <StatusLog entries={job.statusLog} />

        {job.scopeChange && <ScopeChangeCard scopeChange={job.scopeChange} />}

        <PaymentRow payment={job.detailPayment} />

        <JobPhotos
          before={job.beforePhotos}
          after={job.afterPhotos}
        />

        {job.customerRating && <CustomerRatingCard rating={job.customerRating} />}
      </ScrollView>

      <View
        className="flex-row items-center gap-3 px-4 pt-3 bg-surface-card border-t border-zn-border"
        style={{ paddingBottom: insets.bottom + 12 }}
      >
        <Pressable
          className="flex-1 flex-row items-center justify-center gap-2 h-12 rounded-[12px] border border-zn-border bg-surface-card"
        >
          <BellDot size={18} color={colors.ink[900]} strokeWidth={2} />
          <Text className="text-body-sm font-semibold text-ink-900">Escalate</Text>
        </Pressable>

        <Pressable
          disabled={!canAssign || assigning || !onAssign}
          onPress={() => setPickerOpen(true)}
          className="flex-[2] flex-row items-center justify-center gap-2 h-12 rounded-[12px]"
          style={{ backgroundColor: colors.brand.accent, opacity: canAssign && !assigning ? 1 : 0.5 }}
        >
          {assigning ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <ArrowLeftRight size={18} color="#FFFFFF" strokeWidth={2} />
              <Text className="text-body-sm font-semibold text-white">{assignLabel}</Text>
            </>
          )}
        </Pressable>
      </View>

      <Modal visible={pickerOpen} transparent animationType="slide" onRequestClose={() => setPickerOpen(false)}>
        <Pressable className="flex-1 justify-end bg-black/40" onPress={() => setPickerOpen(false)}>
          <Pressable
            className="bg-surface-card rounded-t-[20px] px-4 pt-4"
            style={{ paddingBottom: insets.bottom + 16 }}
            onPress={(e) => e.stopPropagation()}
          >
            <Text className="text-title font-bold text-ink-900 mb-1">Assign to technician</Text>
            <Text className="text-body-sm text-ink-500 mb-3">Select one of your technicians</Text>
            <ScrollView style={{ maxHeight: 320 }} showsVerticalScrollIndicator={false}>
              {technicians.length === 0 ? (
                <Text className="text-body-sm text-ink-400 py-6 text-center">No technicians on your team yet.</Text>
              ) : (
                technicians.map((t) => (
                  <Pressable
                    key={t.id}
                    onPress={() => {
                      setPickerOpen(false);
                      onAssign?.(t.id);
                    }}
                    className="flex-row items-center justify-between py-3 border-b border-zn-border"
                  >
                    <Text className="text-body text-ink-900">{t.name}</Text>
                    <Text className="text-caption text-ink-400 capitalize">{t.status}</Text>
                  </Pressable>
                ))
              )}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
