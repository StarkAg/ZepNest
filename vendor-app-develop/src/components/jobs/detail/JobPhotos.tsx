import { Camera, CheckCircle } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { colors } from '@/src/theme/colors';
import type { PhotoSet } from '@/src/types/jobs';

type PhotoBlockProps = {
  label: string;
  photos: PhotoSet;
};

function PhotoBlock({ label, photos }: PhotoBlockProps) {
  const isComplete = photos.uploaded >= photos.minimum;

  return (
    <View className="flex-1 gap-2">
      <View className="flex-row items-center gap-1.5">
        <Text className="text-caption font-bold text-ink-700">{label}</Text>
        {isComplete && (
          <CheckCircle size={13} color={colors.status.available.text} strokeWidth={2.5} />
        )}
      </View>
      <View className="flex-row gap-2">
        {Array.from({ length: photos.minimum }).map((_, i) => {
          const filled = i < photos.uploaded;
          return (
            <View
              key={i}
              className="flex-1 aspect-square rounded-[8px] items-center justify-center"
              style={{
                backgroundColor: filled ? colors.status.available.bg : colors.surface.sunken,
                borderWidth: 1.5,
                borderColor: filled ? colors.status.available.text : colors.border.subtle,
                borderStyle: filled ? 'solid' : 'dashed',
              }}
            >
              {filled ? (
                <CheckCircle size={18} color={colors.status.available.text} strokeWidth={2} />
              ) : (
                <Camera size={16} color={colors.ink[300]} strokeWidth={1.5} />
              )}
            </View>
          );
        })}
      </View>
      <Text className="text-micro font-medium text-ink-500">
        {photos.uploaded}/{photos.minimum} photos uploaded
      </Text>
    </View>
  );
}

type JobPhotosProps = {
  before: PhotoSet;
  after?: PhotoSet;
};

export function JobPhotos({ before, after }: JobPhotosProps) {
  return (
    <View className="mx-4 mt-4">
      <Text
        className="text-micro font-bold uppercase text-ink-500 mb-2"
        style={{ letterSpacing: 0.8 }}
      >
        Job Photos
      </Text>
      <View className="bg-surface-card rounded-[14px] border border-zn-border p-4">
        <View className="flex-row gap-4">
          <PhotoBlock label="Before" photos={before} />
          {after && <PhotoBlock label="After" photos={after} />}
        </View>
      </View>
    </View>
  );
}
