import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { ArrowLeft, Camera, X } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  useTechnicianDashboardStore,
  type CapturedPhoto,
} from '@/src/store/technicianDashboardStore';
import { colors } from '@/src/theme/colors';

const MIN_PHOTOS = 2;

type PhotoCaptureScreenProps = {
  jobId: string;
  phase: 'before' | 'after';
  onDone: () => void;
  onCancel: () => void;
};

// FR-T1-001 / FR-T1-003: minimum 2 photos, GPS-tagged + timestamped, mandatory before Start Work
// (before) / before Customer OTP can be requested (after). Shared between both phases — the
// capture/GPS/grid UX is identical, only the copy and destination differ.
export function PhotoCaptureScreen({ jobId, phase, onDone, onCancel }: PhotoCaptureScreenProps) {
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const [capturing, setCapturing] = useState(false);
  const submitPhotos = useTechnicianDashboardStore((state) => state.submitPhotos);
  const submittingPhotosJobId = useTechnicianDashboardStore((state) => state.submittingPhotosJobId);
  const submitting = submittingPhotosJobId === jobId;

  const title = phase === 'before' ? 'Before Photos' : 'After Photos';
  const helpText =
    phase === 'before'
      ? 'Take at least 2 photos of the affected area before starting work.'
      : 'Take at least 2 photos of the completed work.';

  async function handleCapture() {
    setCapturing(true);
    try {
      const cameraPerm = await ImagePicker.requestCameraPermissionsAsync();
      if (!cameraPerm.granted) {
        Alert.alert('Camera permission needed', 'Enable camera access to take job photos.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({ quality: 0.7, exif: false });
      if (result.canceled || !result.assets?.[0]) return;
      const asset = result.assets[0];

      let latitude: number | null = null;
      let longitude: number | null = null;
      const locationPerm = await Location.requestForegroundPermissionsAsync();
      if (locationPerm.granted) {
        try {
          const pos = await Location.getCurrentPositionAsync({});
          latitude = pos.coords.latitude;
          longitude = pos.coords.longitude;
        } catch {
          // GPS unavailable — photo is still captured, just without coordinates.
        }
      }

      const extMatch = /\.(\w+)$/.exec(asset.uri);
      const fileExtension = extMatch?.[1]?.toLowerCase() || 'jpg';
      setPhotos((prev) => [
        ...prev,
        {
          localUri: asset.uri,
          fileExtension,
          contentType: asset.mimeType || 'image/jpeg',
          latitude,
          longitude,
          capturedAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setCapturing(false);
    }
  }

  function handleRemove(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    const ok = await submitPhotos(jobId, phase, photos);
    if (ok) onDone();
    else {
      const message = useTechnicianDashboardStore.getState().photosError;
      Alert.alert('Upload failed', message || 'Could not submit photos. Please try again.');
    }
  }

  const canSubmit = photos.length >= MIN_PHOTOS && !submitting;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center gap-3 px-4 pb-3 pt-2">
        <Pressable
          onPress={onCancel}
          accessibilityRole="button"
          className="h-10 w-10 items-center justify-center rounded-full border border-zn-border">
          <ArrowLeft size={20} color={colors.ink[900]} />
        </Pressable>
        <Text className="flex-1 text-h3 font-extrabold text-ink-900">{title}</Text>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <Text className="mt-1 text-body text-ink-500">{helpText}</Text>
        <Text className="mt-2 text-caption font-semibold text-ink-700">
          {photos.length} / {MIN_PHOTOS} minimum
        </Text>

        <View className="mt-4 flex-row flex-wrap gap-3">
          {photos.map((photo, index) => (
            <View key={photo.localUri + index} className="relative h-24 w-24">
              <Image source={{ uri: photo.localUri }} className="h-24 w-24 rounded-[10px]" />
              <Pressable
                onPress={() => handleRemove(index)}
                accessibilityRole="button"
                className="absolute -right-2 -top-2 h-6 w-6 items-center justify-center rounded-full bg-black/70">
                <X size={14} color="#FFFFFF" />
              </Pressable>
            </View>
          ))}

          <Pressable
            onPress={handleCapture}
            disabled={capturing}
            accessibilityRole="button"
            className="h-24 w-24 items-center justify-center rounded-[10px] border border-dashed"
            style={{ borderColor: colors.border.default }}>
            {capturing ? (
              <ActivityIndicator color={colors.ink[500]} />
            ) : (
              <Camera size={22} color={colors.ink[500]} strokeWidth={2} />
            )}
          </Pressable>
        </View>
      </ScrollView>

      <View className="border-t border-zn-border px-4 pb-6 pt-3">
        <Pressable
          onPress={handleSubmit}
          disabled={!canSubmit}
          accessibilityRole="button"
          className="h-12 items-center justify-center rounded-xl"
          style={{ backgroundColor: colors.brand.header, opacity: canSubmit ? 1 : 0.5 }}>
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-body font-bold text-white">Submit {title}</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
