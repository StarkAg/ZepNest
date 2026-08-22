import { Clock, Loader } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { formatRupees } from '@/lib/utils';
import type { NetPayoutData } from '@/src/types/earnings';
import { colors } from '@/src/theme/colors';

function SettlementBadge({ status }: { status: NetPayoutData['settlementStatus'] }) {
  const isPending = status === 'pending';
  return (
    <View
      className="flex-row items-center gap-1 px-3 py-1.5 rounded-full"
      style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}
    >
      {isPending ? (
        <Clock size={12} color="rgba(255,255,255,0.9)" />
      ) : (
        <Loader size={12} color="rgba(255,255,255,0.9)" />
      )}
      <Text className="text-caption font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>
        {isPending ? 'Settlement pending' : 'In progress'}
      </Text>
    </View>
  );
}

export function NetPayoutCard({ data }: { data: NetPayoutData }) {
  return (
    <View className="mx-4 mt-4 rounded-[14px] p-5" style={{ backgroundColor: colors.brand.header }}>
      <View className="flex-row items-start justify-between mb-3">
        <Text
          className="text-[11px] font-bold flex-1 mr-3"
          style={{ color: 'rgba(255,255,255,0.72)', letterSpacing: 0.7 }}
        >
          {data.label}
        </Text>
        <SettlementBadge status={data.settlementStatus} />
      </View>

      <Text
        className="font-extrabold text-white"
        style={{ fontSize: 40, letterSpacing: -0.5, lineHeight: 48 }}
      >
        {formatRupees(data.netPayout)}
      </Text>

      <View className="border-t mt-4 pt-3 flex-row gap-8" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
        <View>
          <Text
            className="text-[11px] font-bold mb-1"
            style={{ color: 'rgba(255,255,255,0.62)', letterSpacing: 0.7 }}
          >
            GROSS REVENUE
          </Text>
          <Text className="text-title font-bold text-white">{formatRupees(data.grossRevenue)}</Text>
        </View>
        <View>
          <Text
            className="text-[11px] font-bold mb-1"
            style={{ color: 'rgba(255,255,255,0.62)', letterSpacing: 0.7 }}
          >
            NEXT PAYOUT
          </Text>
          <Text className="text-title font-bold text-white">{data.nextPayoutLabel}</Text>
        </View>
      </View>
    </View>
  );
}
