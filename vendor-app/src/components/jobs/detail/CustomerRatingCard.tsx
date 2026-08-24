import { Star } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { colors } from '@/src/theme/colors';
import type { CustomerRating } from '@/src/types/jobs';

type CustomerRatingCardProps = {
  rating: CustomerRating;
};

export function CustomerRatingCard({ rating }: CustomerRatingCardProps) {
  return (
    <View className="mx-4 mt-4">
      <Text
        className="text-micro font-bold uppercase text-ink-500 mb-2"
        style={{ letterSpacing: 0.8 }}
      >
        Customer Rating
      </Text>
      <View className="bg-surface-card rounded-[14px] border border-zn-border p-4 gap-3">
        {/* Stars + reviewer */}
        <View className="flex-row items-center gap-3">
          <View className="flex-row gap-[3px]">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={18}
                color={i < rating.rating ? '#F59E0B' : colors.ink[200]}
                fill={i < rating.rating ? '#F59E0B' : 'transparent'}
                strokeWidth={1.5}
              />
            ))}
          </View>
          <Text className="text-body-sm font-bold text-ink-900">
            {rating.rating.toFixed(1)}
          </Text>
          <Text className="text-caption font-medium text-ink-500 flex-1" numberOfLines={1}>
            by {rating.reviewerName}
          </Text>
        </View>

        {/* Comment */}
        {rating.comment ? (
          <View
            className="rounded-[10px] p-3"
            style={{ backgroundColor: colors.surface.sunken }}
          >
            <Text className="text-body-sm font-medium text-ink-700 leading-5">
              {'"'}{rating.comment}{'"'}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}
