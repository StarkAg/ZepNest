import { useEffect } from 'react';
import { View } from 'react-native';

import { TechnicianList } from '@/src/components/technician/TechnicianList';
import { FilterPillGroup } from '@/src/components/ui/FilterPillGroup';
import { TEAM_FILTER_OPTIONS } from '@/src/data/dashboardMock';
import { useTechnicianStore } from '@/src/store/technicianStore';
import type { Technician } from '@/src/types/technician';

type MyTeamTabProps = {
  activeFilter: string;
  onFilterChange: (key: string) => void;
  onTechnicianPress: (technician: Technician) => void;
};

export function MyTeamTab({ activeFilter, onFilterChange, onTechnicianPress }: MyTeamTabProps) {
  const { technicians, isLoading, error, fetch } = useTechnicianStore();

  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <View className="flex-1 bg-surface-app">
      <View className="bg-surface-card border-b border-zn-border">
        <FilterPillGroup
          options={TEAM_FILTER_OPTIONS}
          selectedKey={activeFilter}
          onSelect={onFilterChange}
        />
      </View>
      <TechnicianList
        technicians={technicians}
        activeFilter={activeFilter}
        isLoading={isLoading}
        error={error}
        onTechnicianPress={onTechnicianPress}
        onRefresh={fetch}
      />
    </View>
  );
}
