import { Text, View } from 'react-native';

type JobSectionHeaderProps = {
  title: string;
  meta: string;
};

export function JobSectionHeader({ title, meta }: JobSectionHeaderProps) {
  return (
    <View className="flex-row items-center justify-between mx-4 mt-4 mb-2">
      <Text
        className="text-micro font-bold uppercase text-ink-500"
        style={{ letterSpacing: 0.8 }}
      >
        {title}
      </Text>
      <Text className="text-caption text-ink-400">{meta}</Text>
    </View>
  );
}
