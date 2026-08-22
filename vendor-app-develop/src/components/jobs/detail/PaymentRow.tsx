import { Text, View } from 'react-native';

import { formatRupees } from '@/lib/utils';
import { DETAIL_PAYMENT_CONFIG } from '@/src/components/jobs/jobConfig';
import type { JobDetailPayment } from '@/src/types/jobs';

type PaymentRowProps = {
  payment: JobDetailPayment;
};

export function PaymentRow({ payment }: PaymentRowProps) {
  const cfg = DETAIL_PAYMENT_CONFIG[payment.type];
  const PayIcon = cfg.Icon;

  return (
    <View className="mx-4 mt-4">
      <Text
        className="text-micro font-bold uppercase text-ink-500 mb-2"
        style={{ letterSpacing: 0.8 }}
      >
        Payment
      </Text>
      <View className="bg-surface-card rounded-[14px] border border-zn-border p-4 flex-row items-center gap-3">
        <View
          className="w-10 h-10 rounded-[10px] items-center justify-center"
          style={{ backgroundColor: cfg.iconBg }}
        >
          <PayIcon size={18} color={cfg.iconColor} strokeWidth={2} />
        </View>

        <View className="flex-1 gap-[2px]">
          <Text className="text-body-sm font-bold text-ink-900">{cfg.label}</Text>
          <Text className="text-caption font-medium text-ink-500">{cfg.subLabel}</Text>
        </View>

        <Text className="text-h2 font-extrabold text-ink-900">
          {formatRupees(payment.amount)}
        </Text>
      </View>
    </View>
  );
}
