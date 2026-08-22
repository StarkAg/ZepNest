import { Map } from 'lucide-react-native';
import { Text, View } from 'react-native';

// TODO: integrate react-native-maps with live GPS pins coloured by TechnicianStatus
export function MapTab() {
  return (
    <View className="flex-1 items-center justify-center bg-surface-app">
      <Map size={40} color="#B5C0C5" />
      <Text className="text-body text-ink-400 mt-3">Map · live GPS pins</Text>
    </View>
  );
}
