import { Text, View } from 'react-native';

import type { ScheduledJob } from '@/src/types/technician';

import { ScheduleJobCard } from './ScheduleJobCard';

type TodaysScheduleProps = {
  jobs: ScheduledJob[];
  totalJobs: number;
  jobsDone: number;
};

export function TodaysSchedule({ jobs, totalJobs, jobsDone }: TodaysScheduleProps) {
  return (
    <View className="mx-4 mt-4 gap-2">
      <View className="flex-row items-center justify-between">
        <Text className="text-micro font-bold uppercase text-ink-500" style={{ letterSpacing: 0.8 }}>
          {"Today's Schedule"}
        </Text>
        <Text className="text-caption text-ink-400">
          {totalJobs} jobs · {jobsDone} done
        </Text>
      </View>
      <View className="gap-2">
        {jobs.map((job) => (
          <ScheduleJobCard key={job.id} job={job} />
        ))}
      </View>
    </View>
  );
}
