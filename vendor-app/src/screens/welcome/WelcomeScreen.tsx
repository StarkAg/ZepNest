import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ZepNestLogo from '@/assets/zepnest-logo.svg';
import { colors } from '@/src/theme/colors';

type WelcomeScreenProps = {
  onContinueWithMobile: () => void;
};

export function WelcomeScreen({ onContinueWithMobile }: WelcomeScreenProps) {
  return (
    <LinearGradient
      colors={[colors.brand.header, colors.brand.headerDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      locations={[0.0094, 0.9745]}
      style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 px-[30px]">
        <View className="flex-1 items-center justify-center">
          <View className="mb-3 flex-row items-center gap-3">
            {/* it is the placeholder for the logo, you can replace it with your own logo component or image */}
            <ZepNestLogo width={76} height={49} />
            <Text className="text-[40px] font-semibold text-white" style={{ letterSpacing: -2 }}>
              ZepNest
            </Text>
          </View>
          <Text className="text-center text-[20px] font-medium text-white">Partner App</Text>
        </View>

        <View className="pb-10">
          <Pressable
            onPress={onContinueWithMobile}
            accessibilityRole="button"
            className="h-[38px] items-center justify-center rounded-lg bg-white">
            <Text className="text-base font-semibold text-gray-900">
              Continue with Mobile Number
            </Text>
          </Pressable>

          {/* its just a text placeholder for the privacy policy and terms of service, you can replace it with your own links or components */}
          <View className="mt-8 flex-row items-center justify-center gap-6">
            <Text className="text-[13px] font-semibold text-white/50">Privacy policy</Text>
            <Text className="text-[13px] font-semibold text-white/50">Terms of Service</Text>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
