import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from 'react-native';
import { MapPin } from 'lucide-react-native';

import { useVendorZonesStore } from '@/src/store/vendorZonesStore';
import { colors } from '@/src/theme/colors';
import type { VendorZoneCategory } from '@/src/types/vendor';

/**
 * My Zone — read-only view of the vendor's coverage (Admin SRS §12.6).
 *
 * Shows the (pincode × service category) pairs the vendor is contracted for, grouped by pincode.
 * The grouping carries the meaning: a vendor may serve Electrical in one pincode and AC Service in
 * another, so "3 pincodes and 2 categories" does NOT imply all six combinations. A flat list of each
 * would hide exactly the distinction that decides which jobs reach this vendor.
 *
 * Everything here is read-only per FR-VEND-003 — commission rates and pincode assignments are set by
 * Zepnest ops, not by the vendor.
 */

function commissionLabel(c: VendorZoneCategory): string {
  if (c.commissionValue === null) return '—';
  if (c.commissionType === 'fixed') return `₹${c.commissionValue}/job`;
  if (c.commissionType === 'percentage') return `${c.commissionValue}% of job`;
  return `Min ₹${c.commissionMinValue ?? 0} or ${c.commissionValue}%`;
}

/**
 * Zone status reuses the reserved status tokens rather than new hues:
 * active → available (green), pending → enRoute (amber), suspended → offline (red).
 */
const ZONE_STATUS_TOKEN: Record<
  VendorZoneCategory['status'],
  { token: { bg: string; text: string; dot: string }; label: string }
> = {
  active: { token: colors.status.available, label: 'Active' },
  pending: { token: colors.status.enRoute, label: 'Pending' },
  suspended: { token: colors.status.offline, label: 'Suspended' },
};

function StatusPill({ status }: { status: VendorZoneCategory['status'] }) {
  const { token, label } = ZONE_STATUS_TOKEN[status];
  return (
    <View className="rounded-[8px] px-2 py-0.5" style={{ backgroundColor: token.bg }}>
      <Text className="text-body-xs" style={{ color: token.text, fontWeight: '700' }}>
        {label}
      </Text>
    </View>
  );
}

export function MyZoneTab() {
  const { data: zones, isLoading, error, loadZones } = useVendorZonesStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    void loadZones();
  }, [loadZones]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadZones();
    setRefreshing(false);
  }, [loadZones]);

  if (isLoading && !zones) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: colors.surface.app }}>
        <ActivityIndicator />
      </View>
    );
  }

  const pincodes = zones?.pincodes ?? [];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.surface.app }}
      contentContainerStyle={{ padding: 16, paddingBottom: 120, gap: 12 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      showsVerticalScrollIndicator={false}>
      {error ? (
        <View className="rounded-[12px] p-4" style={{ backgroundColor: colors.status.offline.bg }}>
          <Text className="text-body-sm" style={{ color: colors.status.offline.text }}>
            {error}
          </Text>
        </View>
      ) : null}

      {pincodes.length === 0 && !error ? (
        <View className="rounded-[12px] p-4" style={{ backgroundColor: colors.surface.card }}>
          <Text className="text-body-sm" style={{ color: colors.ink[500] }}>
            No zones assigned yet. Zepnest ops assigns the pincodes and service categories you cover
            — until then, no jobs will be routed to you.
          </Text>
        </View>
      ) : null}

      {pincodes.length > 0 ? (
        <View className="rounded-[12px] p-4" style={{ backgroundColor: colors.surface.card }}>
          <Text className="text-body-sm" style={{ color: colors.ink[500] }}>
            You cover{' '}
            <Text style={{ fontWeight: '700', color: colors.ink[900] }}>
              {zones?.totalZones} {zones?.totalZones === 1 ? 'zone' : 'zones'}
            </Text>{' '}
            across{' '}
            <Text style={{ fontWeight: '700', color: colors.ink[900] }}>
              {pincodes.length} {pincodes.length === 1 ? 'pincode' : 'pincodes'}
            </Text>
            . Categories differ per pincode — only the combinations listed below are routed to you.
          </Text>
        </View>
      ) : null}

      {pincodes.map((p) => (
        <View
          key={p.areaId}
          className="overflow-hidden rounded-[12px]"
          style={{ backgroundColor: colors.surface.card }}>
          <View
            className="flex-row items-center gap-2 px-4 py-3"
            style={{ backgroundColor: colors.surface.sunken }}>
            <MapPin size={16} color={colors.ink[500]} />
            <Text className="text-body-md" style={{ fontWeight: '700', color: colors.ink[900] }}>
              {p.zipcode}
              {p.localityName ? ` · ${p.localityName}` : ''}
            </Text>
            {p.areaStatus !== 'active' ? (
              <View
                className="rounded-[8px] px-2 py-0.5"
                style={{ backgroundColor: colors.status.enRoute.bg }}>
                <Text
                  className="text-body-xs"
                  style={{ color: colors.status.enRoute.text, fontWeight: '700' }}>
                  {p.areaStatus === 'coming_soon' ? 'Coming soon' : 'Paused'}
                </Text>
              </View>
            ) : null}
          </View>

          {p.categories.map((c, idx) => (
            <View
              key={c.categoryId}
              className="px-4 py-3"
              style={
                idx < p.categories.length - 1
                  ? { borderBottomWidth: 1, borderBottomColor: colors.border.subtle }
                  : undefined
              }>
              <View className="flex-row items-center justify-between gap-2">
                <View style={{ flex: 1 }}>
                  <Text
                    className="text-body-md"
                    style={{ fontWeight: '600', color: colors.ink[900] }}>
                    {c.categoryName}
                  </Text>
                  {c.sectionName ? (
                    <Text className="text-body-xs" style={{ color: colors.ink[500], marginTop: 1 }}>
                      {c.sectionName}
                    </Text>
                  ) : null}
                </View>
                <StatusPill status={c.status} />
              </View>
              <View className="mt-2 flex-row items-center justify-between">
                <Text className="text-body-sm" style={{ color: colors.ink[500] }}>
                  {c.technicianCount} {c.technicianCount === 1 ? 'technician' : 'technicians'}{' '}
                  assigned
                </Text>
                <Text
                  className="text-body-sm"
                  style={{ fontWeight: '700', color: colors.money.neutral }}>
                  {commissionLabel(c)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      ))}

      {pincodes.length > 0 ? (
        <Text className="text-body-xs px-1" style={{ color: colors.ink[500] }}>
          Commission rates and zone assignments are set by Zepnest and cannot be changed here.
          Contact ops to request a new pincode or service category.
        </Text>
      ) : null}
    </ScrollView>
  );
}

export default MyZoneTab;
