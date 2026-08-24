import {
  AlertTriangle,
  ArrowLeft,
  Camera,
  Check,
  Clock,
  CreditCard,
  MapPin,
  ShieldCheck,
  User,
} from 'lucide-react-native';
import type { ComponentType } from 'react';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { formatCountdown, formatRupees, getAcceptanceState } from '@/lib/utils';
import { ScopeChangeCard } from '@/src/components/jobs/detail/ScopeChangeCard';
import { JobStatusBadge } from '@/src/components/technicianDashboard/JobStatusBadge';
import { OtpEntrySheet } from '@/src/components/technicianDashboard/OtpEntrySheet';
import { useCountdownTo } from '@/src/hooks/useCountdownTo';
import { useTechnicianDashboardStore } from '@/src/store/technicianDashboardStore';
import { colors } from '@/src/theme/colors';
import type { JobStatus, TodaysJob } from '@/src/types/job';

// SRS §9.2 step 5C: alert the technician when 2 minutes remain in the approval window.
const SCOPE_CHANGE_WARNING_SECONDS = 120;
// No push infra exists in this stack — poll while a decision is pending so the technician's
// screen picks up the customer's approve/decline without a manual pull-to-refresh.
const SCOPE_CHANGE_POLL_MS = 5000;
// Vendor-assign 5-minute accept/decline window: warn in the last 60 seconds.
const ACCEPT_WARNING_SECONDS = 60;

const MIN_PHOTOS = 2;

type IconComponent = ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;

// Each status maps to the next action the technician takes to advance the job.
const ACTION_CONFIG: Record<
  JobStatus,
  { label: string; next?: JobStatus; enabled: boolean; bg: string; color: string }
> = {
  assigned: {
    label: 'On my way',
    next: 'enRoute',
    enabled: true,
    bg: colors.brand.header,
    color: '#FFFFFF',
  },
  enRoute: {
    label: "I've arrived",
    next: 'arrived',
    enabled: true,
    bg: colors.brand.header,
    color: '#FFFFFF',
  },
  arrived: {
    label: 'Start work',
    next: 'inProgress',
    enabled: true,
    bg: colors.brand.header,
    color: '#FFFFFF',
  },
  inProgress: {
    label: 'Complete job',
    next: 'completed',
    enabled: true,
    bg: colors.brand.header,
    color: '#FFFFFF',
  },
  completed: {
    label: 'Job completed',
    enabled: false,
    bg: colors.status.available.bg,
    color: colors.status.available.text,
  },
};

type JobDetailScreenProps = {
  job: TodaysJob;
  onBack: () => void;
  onOpenBeforePhotos: () => void;
  onOpenAfterPhotos: () => void;
  onOpenWorkSummary: () => void;
  onOpenScopeChange: () => void;
};

export function JobDetailScreen({
  job,
  onBack,
  onOpenBeforePhotos,
  onOpenAfterPhotos,
  onOpenWorkSummary,
  onOpenScopeChange,
}: JobDetailScreenProps) {
  const [otpSheetVisible, setOtpSheetVisible] = useState(false);
  const advanceJob = useTechnicianDashboardStore((state) => state.advanceJob);
  const advancingJobId = useTechnicianDashboardStore((state) => state.advancingJobId);
  const collectCash = useTechnicianDashboardStore((state) => state.collectCash);
  const collectingCashJobId = useTechnicianDashboardStore((state) => state.collectingCashJobId);
  const acceptJob = useTechnicianDashboardStore((state) => state.acceptJob);
  const acceptingJobId = useTechnicianDashboardStore((state) => state.acceptingJobId);
  const declineJob = useTechnicianDashboardStore((state) => state.declineJob);
  const decliningJobId = useTechnicianDashboardStore((state) => state.decliningJobId);
  const loadJobs = useTechnicianDashboardStore((state) => state.loadJobs);
  const isLoadingJobs = useTechnicianDashboardStore((state) => state.isLoadingJobs);
  const jobTypeColors = colors.jobType[job.typeKey];

  // SRS §5.4: Assigned -> Accepted -> En Route. A newly-assigned job can't move to "On my way"
  // until the technician accepts it — surfaced here as a two-button choice instead of the usual
  // single advance action.
  const needsAcceptance = job.status === 'assigned' && !job.acceptedAt;
  // Only ticks while a deadline is present — never guesses an expiry when the backend hasn't
  // shipped acceptDeadline yet (getAcceptanceState returns 'pending' with no deadline in that case).
  const acceptSecondsLeft = useCountdownTo(needsAcceptance ? job.acceptDeadline : null);
  const acceptWarning = needsAcceptance && !!job.acceptDeadline && acceptSecondsLeft <= ACCEPT_WARNING_SECONDS;
  const acceptExpired = needsAcceptance && getAcceptanceState(job) === 'expired';

  // SRS §9: a pending, unexpired scope change blocks the closure gate server-side (FR-SC-002) —
  // surface that here instead of only discovering it via a 409 on "Complete job".
  const scopeChangePending = job.scopeChange?.status === 'pending';
  const scopeChangeSecondsLeft = useCountdownTo(
    scopeChangePending ? job.scopeChange!.expiresAt : null
  );

  useEffect(() => {
    if (!scopeChangePending) return;
    const interval = setInterval(loadJobs, SCOPE_CHANGE_POLL_MS);
    return () => clearInterval(interval);
  }, [scopeChangePending, loadJobs]);

  // Only a job with an actual pending cash payment needs this step — a job with no payment row at
  // all (e.g. paid online, or not yet initiated) isn't COD and must not be gated on cash collection.
  const needsCashCollection =
    job.status === 'inProgress' &&
    job.paymentMethodRaw === 'cash' &&
    job.paymentStatus !== 'completed';

  // FR-T1-001: >=2 before-photos mandatory before Start Work. Gates the arrived -> inProgress hop.
  const needsBeforePhotos = job.status === 'arrived' && job.beforePhotosCount < MIN_PHOTOS;
  // FR-T1-005 / FR-T1-003 / FR-T1-004: the three closure gates, all live within inProgress.
  const needsWorkSummary = job.status === 'inProgress' && !job.workSummarySubmittedAt;
  const needsAfterPhotos = job.status === 'inProgress' && job.afterPhotosCount < MIN_PHOTOS;
  const needsOtp = job.status === 'inProgress' && !job.otpVerifiedAt;
  const closureChecklistReady = !needsWorkSummary && !needsAfterPhotos && !needsOtp;

  const statusAction = ACTION_CONFIG[job.status];
  const scopeChangeWarning =
    scopeChangePending && scopeChangeSecondsLeft <= SCOPE_CHANGE_WARNING_SECONDS;
  const action = scopeChangePending
    ? {
        ...statusAction,
        label: `Awaiting customer approval — ${formatCountdown(scopeChangeSecondsLeft)}`,
        enabled: false,
        bg: scopeChangeWarning ? colors.status.offline.bg : statusAction.bg,
        color: scopeChangeWarning ? colors.status.offline.text : statusAction.color,
      }
    : needsCashCollection
      ? { ...statusAction, label: `Collect Cash — ${formatRupees(job.amount)}`, enabled: true }
      : needsBeforePhotos
        ? { ...statusAction, label: 'Take Before Photos', enabled: true }
        : job.status === 'inProgress'
          ? { ...statusAction, enabled: statusAction.enabled && closureChecklistReady }
          : statusAction;
  const busy =
    advancingJobId === job.id ||
    collectingCashJobId === job.id ||
    acceptingJobId === job.id ||
    decliningJobId === job.id;

  async function handleAdvance() {
    if (needsBeforePhotos) {
      onOpenBeforePhotos();
      return;
    }
    if (!statusAction.enabled || !statusAction.next) return;
    const ok = await advanceJob(job.id, statusAction.next);
    if (!ok) Alert.alert('Update failed', 'Could not update the job status. Please try again.');
  }

  function handleCollectCash() {
    Alert.alert(
      'Confirm cash received',
      `Confirm ${formatRupees(job.amount)} received in cash from the customer?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            const ok = await collectCash(job.id);
            if (!ok)
              Alert.alert('Update failed', 'Could not record the cash payment. Please try again.');
          },
        },
      ]
    );
  }

  async function handleAccept() {
    const ok = await acceptJob(job.id);
    if (!ok) Alert.alert('Update failed', 'Could not accept the job. Please try again.');
  }

  function handleDecline() {
    Alert.alert('Decline this job?', 'It will go back to the pool for reassignment.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Decline',
        style: 'destructive',
        onPress: async () => {
          const ok = await declineJob(job.id);
          if (ok) onBack();
          else Alert.alert('Update failed', 'Could not decline the job. Please try again.');
        },
      },
    ]);
  }

  const handlePress = needsCashCollection ? handleCollectCash : handleAdvance;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center gap-3 px-4 pb-3 pt-2">
        <Pressable
          onPress={onBack}
          accessibilityRole="button"
          className="h-10 w-10 items-center justify-center rounded-full border border-zn-border">
          <ArrowLeft size={20} color={colors.ink[900]} />
        </Pressable>
        <Text className="flex-1 text-h3 font-extrabold text-ink-900">Job {job.jobNumber}</Text>
        <JobStatusBadge status={job.status} />
      </View>

      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoadingJobs} onRefresh={loadJobs} />}>
        <View className="flex-row items-center gap-2">
          <View
            className="flex-row items-center gap-1.5 rounded-[6px] px-2 py-[4px]"
            style={{ backgroundColor: jobTypeColors.bg }}>
            <Text
              className="text-micro font-bold uppercase"
              style={{ color: jobTypeColors.text, letterSpacing: 0.6 }}>
              {job.typeLabel}
            </Text>
            <View
              className="h-[10px] w-px"
              style={{ backgroundColor: jobTypeColors.text, opacity: 0.3 }}
            />
            <Text className="text-micro font-semibold" style={{ color: jobTypeColors.text }}>
              {job.categoryLabel}
            </Text>
          </View>
          <Text className="text-caption font-medium text-ink-500">{job.timeSlot}</Text>
        </View>

        <View className="mt-3 flex-row items-center justify-between">
          <Text className="mr-2 flex-1 text-h2 font-extrabold text-ink-900">{job.serviceName}</Text>
          <Text className="text-h2 font-extrabold text-ink-900">{formatRupees(job.amount)}</Text>
        </View>

        {needsAcceptance ? (
          <View
            className="mt-3 flex-row items-center gap-2 rounded-[10px] border-2 px-3 py-2.5"
            style={{
              backgroundColor: acceptWarning ? colors.status.offline.bg : colors.status.offDuty.bg,
              borderColor: acceptWarning ? colors.status.offline.dot : colors.status.offDuty.dot,
            }}>
            <Clock
              size={18}
              color={acceptWarning ? colors.status.offline.text : colors.status.offDuty.text}
              strokeWidth={2.5}
            />
            <Text
              className="flex-1 text-body font-extrabold"
              style={{ color: acceptWarning ? colors.status.offline.text : colors.status.offDuty.text }}>
              {acceptExpired
                ? 'Response window has ended'
                : job.acceptDeadline
                  ? `Respond within ${formatCountdown(acceptSecondsLeft)}`
                  : 'New job — accept or decline to continue'}
            </Text>
          </View>
        ) : null}

        <View className="mt-4 h-px bg-zn-border" />

        <View className="mt-4 gap-4 pb-6">
          <DetailRow Icon={User} label="Customer" value={job.customerName} />
          <DetailRow Icon={MapPin} label="Address" value={job.fullAddress} />
          <DetailRow Icon={Clock} label="Time Slot" value={job.timeSlot} />
          <DetailRow Icon={CreditCard} label="Payment" value={job.paymentMethod} />
        </View>

        {job.scopeChange ? (
          <View className="-mx-4 mb-2">
            <ScopeChangeCard scopeChange={job.scopeChange} />
          </View>
        ) : null}

        {job.status === 'inProgress' ? (
          <View
            className="mb-6 gap-2 rounded-[14px] border p-3"
            style={{ borderColor: colors.border.subtle }}>
            <Text
              className="mb-1 text-micro font-bold uppercase text-ink-500"
              style={{ letterSpacing: 0.8 }}>
              Job Closure Checklist
            </Text>
            <ClosureChecklistRow
              Icon={Check}
              label="Work Summary"
              done={!needsWorkSummary}
              onPress={onOpenWorkSummary}
            />
            <ClosureChecklistRow
              Icon={Camera}
              label={`After Photos (${job.afterPhotosCount}/${MIN_PHOTOS})`}
              done={!needsAfterPhotos}
              onPress={onOpenAfterPhotos}
            />
            <ClosureChecklistRow
              Icon={ShieldCheck}
              label="Customer OTP"
              done={!needsOtp}
              onPress={() => setOtpSheetVisible(true)}
            />
          </View>
        ) : null}
      </ScrollView>

      <View className="border-t border-zn-border px-4 pb-6 pt-3">
        {job.status === 'inProgress' && !scopeChangePending ? (
          <Pressable
            onPress={onOpenScopeChange}
            accessibilityRole="button"
            className="mb-3 h-11 flex-row items-center justify-center gap-2 rounded-xl border"
            style={{ borderColor: colors.status.enRoute.text }}>
            <AlertTriangle size={16} color={colors.status.enRoute.text} strokeWidth={2} />
            <Text
              className="text-body-sm font-semibold"
              style={{ color: colors.status.enRoute.text }}>
              Report Scope Change
            </Text>
          </Pressable>
        ) : null}
        {needsAcceptance ? (
          <View className="flex-row gap-3">
            <Pressable
              onPress={handleDecline}
              disabled={busy || acceptExpired}
              accessibilityRole="button"
              className="h-12 flex-1 items-center justify-center rounded-xl border"
              style={{
                borderColor: colors.status.offline.text,
                opacity: busy || acceptExpired ? 0.5 : 1,
              }}>
              {decliningJobId === job.id ? (
                <ActivityIndicator color={colors.status.offline.text} />
              ) : (
                <Text className="text-body font-bold" style={{ color: colors.status.offline.text }}>
                  Decline
                </Text>
              )}
            </Pressable>
            <Pressable
              onPress={handleAccept}
              disabled={busy || acceptExpired}
              accessibilityRole="button"
              className="h-12 flex-1 items-center justify-center rounded-xl"
              style={{
                backgroundColor: colors.brand.header,
                opacity: busy || acceptExpired ? 0.5 : 1,
              }}>
              {acceptingJobId === job.id ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-body font-bold text-white">Accept</Text>
              )}
            </Pressable>
          </View>
        ) : (
          <Pressable
            onPress={handlePress}
            disabled={!action.enabled || busy}
            accessibilityRole="button"
            className="h-12 flex-row items-center justify-center gap-2 rounded-xl"
            style={{ backgroundColor: action.bg, opacity: action.enabled && !busy ? 1 : 0.7 }}>
            {busy ? (
              <ActivityIndicator color={action.color} />
            ) : (
              <Text className="text-body font-bold" style={{ color: action.color }}>
                {action.label}
              </Text>
            )}
          </Pressable>
        )}
      </View>

      <OtpEntrySheet
        jobId={job.id}
        visible={otpSheetVisible}
        onClose={() => setOtpSheetVisible(false)}
      />
    </SafeAreaView>
  );
}

function ClosureChecklistRow({
  Icon,
  label,
  done,
  onPress,
}: {
  Icon: IconComponent;
  label: string;
  done: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={done}
      accessibilityRole="button"
      className="flex-row items-center gap-3 rounded-[10px] px-2 py-2">
      <View
        className="h-7 w-7 items-center justify-center rounded-full"
        style={{ backgroundColor: done ? colors.status.available.bg : colors.surface.sunken }}>
        <Icon
          size={14}
          color={done ? colors.status.available.dot : colors.ink[500]}
          strokeWidth={2}
        />
      </View>
      <Text className="flex-1 text-body font-medium text-ink-900">{label}</Text>
      {done ? (
        <Check size={16} color={colors.status.available.dot} strokeWidth={3} />
      ) : (
        <Text className="text-caption font-semibold" style={{ color: colors.brand.header }}>
          Add
        </Text>
      )}
    </Pressable>
  );
}

function DetailRow({ Icon, label, value }: { Icon: IconComponent; label: string; value: string }) {
  return (
    <View className="flex-row items-start gap-3">
      <View className="h-9 w-9 items-center justify-center rounded-[10px] bg-surface-sunken">
        <Icon size={16} color={colors.ink[700]} strokeWidth={2} />
      </View>
      <View className="flex-1">
        <Text
          className="text-micro font-bold uppercase text-ink-500"
          style={{ letterSpacing: 0.8 }}>
          {label}
        </Text>
        <Text className="mt-0.5 text-body font-semibold text-ink-900">{value}</Text>
      </View>
    </View>
  );
}
