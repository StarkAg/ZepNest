import { ArrowLeft, Check } from 'lucide-react-native';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { WORK_SUMMARY_CATEGORIES, type WorkSummaryCategory } from '@/src/data/workSummaryTasks';
import { useTechnicianDashboardStore } from '@/src/store/technicianDashboardStore';
import { colors } from '@/src/theme/colors';

type WorkSummaryScreenProps = {
  jobId: string;
  onDone: () => void;
  onCancel: () => void;
};

// FR-T1-005: task checklist selection mandatory before a job can close; free-text notes optional.
export function WorkSummaryScreen({ jobId, onDone, onCancel }: WorkSummaryScreenProps) {
  const [category, setCategory] = useState<WorkSummaryCategory>('electrical');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [otherText, setOtherText] = useState('');
  const [notes, setNotes] = useState('');
  const submitWorkSummary = useTechnicianDashboardStore((state) => state.submitWorkSummary);
  const submittingWorkSummaryJobId = useTechnicianDashboardStore(
    (state) => state.submittingWorkSummaryJobId
  );
  const submitting = submittingWorkSummaryJobId === jobId;

  const activeCategory = WORK_SUMMARY_CATEGORIES.find((c) => c.key === category)!;
  const canSubmit = (selectedTasks.length > 0 || otherText.trim().length > 0) && !submitting;

  function toggleTask(task: string) {
    setSelectedTasks((prev) =>
      prev.includes(task) ? prev.filter((t) => t !== task) : [...prev, task]
    );
  }

  function handleCategoryChange(next: WorkSummaryCategory) {
    setCategory(next);
    setSelectedTasks([]);
  }

  async function handleSubmit() {
    const finalTasks = [...selectedTasks, ...(otherText.trim() ? [otherText.trim()] : [])];
    const ok = await submitWorkSummary(jobId, category, finalTasks, notes.trim() || undefined);
    if (ok) onDone();
    else Alert.alert('Submit failed', 'Could not submit the work summary. Please try again.');
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center gap-3 px-4 pb-3 pt-2">
        <Pressable
          onPress={onCancel}
          accessibilityRole="button"
          className="h-10 w-10 items-center justify-center rounded-full border border-zn-border">
          <ArrowLeft size={20} color={colors.ink[900]} />
        </Pressable>
        <Text className="flex-1 text-h3 font-extrabold text-ink-900">Work Summary</Text>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <Text className="mt-1 text-body text-ink-500">
          Select the tasks you performed. Notes are optional.
        </Text>

        <View className="mt-4 flex-row gap-2">
          {WORK_SUMMARY_CATEGORIES.map((c) => {
            const active = c.key === category;
            return (
              <Pressable
                key={c.key}
                onPress={() => handleCategoryChange(c.key)}
                accessibilityRole="button"
                className="rounded-full px-4 py-2"
                style={{
                  backgroundColor: active ? colors.pill.selectedBg : colors.pill.defaultBg,
                  borderWidth: active ? 0 : 1,
                  borderColor: colors.pill.defaultBorder,
                }}>
                <Text
                  className="text-caption font-semibold"
                  style={{ color: active ? colors.pill.selectedText : colors.pill.defaultText }}>
                  {c.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View className="mt-4 gap-2">
          {activeCategory.tasks.map((task) => {
            const checked = selectedTasks.includes(task);
            return (
              <Pressable
                key={task}
                onPress={() => toggleTask(task)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked }}
                className="flex-row items-center gap-3 rounded-[10px] border px-3 py-3"
                style={{ borderColor: checked ? colors.brand.header : colors.border.subtle }}>
                <View
                  className="h-5 w-5 items-center justify-center rounded-[6px] border"
                  style={{
                    borderColor: checked ? colors.brand.header : colors.border.default,
                    backgroundColor: checked ? colors.brand.header : 'transparent',
                  }}>
                  {checked ? <Check size={14} color="#FFFFFF" strokeWidth={3} /> : null}
                </View>
                <Text className="flex-1 text-body text-ink-900">{task}</Text>
              </Pressable>
            );
          })}

          <View>
            <Text
              className="mb-1 text-micro font-bold uppercase text-ink-500"
              style={{ letterSpacing: 0.8 }}>
              Other (free text)
            </Text>
            <TextInput
              value={otherText}
              onChangeText={setOtherText}
              placeholder="Describe any other task performed"
              placeholderTextColor={colors.ink[400]}
              className="rounded-[10px] border px-3 py-3 text-body text-ink-900"
              style={{ borderColor: colors.border.subtle }}
            />
          </View>
        </View>

        <View className="mt-4">
          <Text
            className="mb-1 text-micro font-bold uppercase text-ink-500"
            style={{ letterSpacing: 0.8 }}>
            Notes (optional)
          </Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Materials used, observations, etc."
            placeholderTextColor={colors.ink[400]}
            multiline
            numberOfLines={4}
            className="min-h-[96px] rounded-[10px] border px-3 py-3 text-body text-ink-900"
            style={{ borderColor: colors.border.subtle, textAlignVertical: 'top' }}
          />
        </View>

        <View className="h-6" />
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
            <Text className="text-body font-bold text-white">Submit Work Summary</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
