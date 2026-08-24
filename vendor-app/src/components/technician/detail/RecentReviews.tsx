import { Star } from 'lucide-react-native';
import { Text, View } from 'react-native';

import type { TechnicianReview } from '@/src/types/technician';

function StarRow({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <View className="flex-row gap-[2px]">
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          size={13}
          color="#E8920C"
          fill={i < rating ? '#E8920C' : 'transparent'}
          strokeWidth={1.5}
        />
      ))}
    </View>
  );
}

function ReviewItem({ review }: { review: TechnicianReview }) {
  return (
    <View className="gap-2 py-3 border-b border-zn-border last:border-b-0">
      <View className="flex-row items-center justify-between">
        <StarRow rating={review.rating} />
        <Text className="text-caption text-ink-400">
          {review.reviewerMasked} · {review.daysAgo}
        </Text>
      </View>
      <Text className="text-body-sm text-ink-700">{review.comment}</Text>
    </View>
  );
}

type RecentReviewsProps = {
  reviews: TechnicianReview[];
  avgRating: number;
  totalReviews: number;
};

export function RecentReviews({ reviews, avgRating, totalReviews }: RecentReviewsProps) {
  return (
    <View className="mx-4 mt-4 gap-2">
      <View className="flex-row items-center justify-between">
        <Text className="text-micro font-bold uppercase text-ink-500" style={{ letterSpacing: 0.8 }}>
          Recent Reviews
        </Text>
        <View className="flex-row items-center gap-1">
          <Star size={12} color="#E8920C" fill="#E8920C" strokeWidth={1.5} />
          <Text className="text-caption font-semibold text-ink-700">
            {avgRating.toFixed(1)}
          </Text>
          <Text className="text-caption text-ink-400">· {totalReviews} reviews</Text>
        </View>
      </View>
      <View className="bg-surface-card rounded-[14px] border border-zn-border px-3">
        {reviews.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </View>
    </View>
  );
}
