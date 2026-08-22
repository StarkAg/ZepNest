import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from 'react-native';

import { JobCard } from '@/src/components/jobs/JobCard';
import { JobSearchBar } from '@/src/components/jobs/JobSearchBar';
import { JobSectionHeader } from '@/src/components/jobs/JobSectionHeader';
import { JobSortPills } from '@/src/components/jobs/JobSortPills';
import { JobsSummary } from '@/src/components/jobs/JobsSummary';
import { SegmentControl } from '@/src/components/jobs/SegmentControl';
import { useJobsStore } from '@/src/store/jobsStore';
import type { Job, JobPeriod, JobSortKey, JobStatus } from '@/src/types/jobs';

const ACTIVE_STATUSES: JobStatus[] = ['inProgress', 'arrived', 'enRoute'];
const SCHEDULED_STATUSES: JobStatus[] = ['assigned'];

const SORT_FNS: Record<JobSortKey, (a: Job, b: Job) => number> = {
  time:        (a, b) => a.timeLabel.localeCompare(b.timeLabel),
  status:      (a, b) => a.jobStatus.localeCompare(b.jobStatus),
  technician:  (a, b) => a.technician.name.localeCompare(b.technician.name),
  amount:      (a, b) => b.amount - a.amount,
};

function applySearch(jobs: Job[], query: string): Job[] {
  if (!query.trim()) return jobs;
  const q = query.toLowerCase();
  return jobs.filter(
    (j) =>
      j.name.toLowerCase().includes(q) ||
      j.jobNumber.toLowerCase().includes(q) ||
      j.location.toLowerCase().includes(q) ||
      j.technician.name.toLowerCase().includes(q)
  );
}

export function JobsTab() {
  const [period, setPeriod] = useState<JobPeriod>('today');
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<JobSortKey>('time');

  const { jobs, isLoading, error, loadJobs } = useJobsStore();

  useEffect(() => {
    loadJobs(period);
  }, [period, loadJobs]);

  const filtered = useMemo(() => applySearch(jobs, query), [jobs, query]);

  const activeJobs    = useMemo(() => filtered.filter((j) => ACTIVE_STATUSES.includes(j.jobStatus)).sort(SORT_FNS[sortKey]), [filtered, sortKey]);
  const scheduledJobs = useMemo(() => filtered.filter((j) => SCHEDULED_STATUSES.includes(j.jobStatus)).sort(SORT_FNS[sortKey]), [filtered, sortKey]);
  const completedJobs = useMemo(() => filtered.filter((j) => j.jobStatus === 'completed').sort(SORT_FNS[sortKey]), [filtered, sortKey]);

  const activeAndScheduled = useMemo(() => [...activeJobs, ...scheduledJobs], [activeJobs, scheduledJobs]);

  const rawActiveCount    = jobs.filter((j) => ACTIVE_STATUSES.includes(j.jobStatus)).length;
  const rawScheduledCount = jobs.filter((j) => SCHEDULED_STATUSES.includes(j.jobStatus)).length;
  const rawCompletedCount = jobs.filter((j) => j.jobStatus === 'completed').length;

  return (
    <View className="flex-1 bg-surface-app">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl refreshing={isLoading && jobs.length > 0} onRefresh={() => loadJobs(period)} />
        }
      >
        <SegmentControl selected={period} onSelect={setPeriod} />
        <JobSearchBar value={query} onChangeText={setQuery} />
        <JobSortPills selected={sortKey} onSelect={setSortKey} />

        <JobsSummary
          activeNow={rawActiveCount}
          scheduled={rawScheduledCount}
          completed={rawCompletedCount}
        />

        {activeAndScheduled.length > 0 ? (
          <>
            <JobSectionHeader
              title={period === 'today' ? 'In Progress & Scheduled' : 'Scheduled'}
              meta={`${activeAndScheduled.length} jobs`}
            />
            <View className="gap-2">
              {activeAndScheduled.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </View>
          </>
        ) : null}

        {completedJobs.length > 0 ? (
          <>
            <JobSectionHeader
              title="Completed"
              meta={`${completedJobs.length} jobs`}
            />
            <View className="gap-2">
              {completedJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </View>
          </>
        ) : null}

        {isLoading ? (
          <View className="flex-1 items-center justify-center mt-16">
            <ActivityIndicator />
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center mt-16">
            <Text className="text-body text-ink-400">{error}</Text>
          </View>
        ) : filtered.length === 0 ? (
          <View className="flex-1 items-center justify-center mt-16">
            <Text className="text-body text-ink-400">No jobs match your search.</Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
