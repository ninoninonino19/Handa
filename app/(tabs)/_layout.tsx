import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#fff', height: 60, paddingBottom: 8 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Map', tabBarIcon: ({ color, size }) => <Ionicons name="map" size={size} color={color} /> }} />
      <Tabs.Screen name="list" options={{ title: 'List', tabBarIcon: ({ color, size }) => <Ionicons name="list" size={size} color={color} /> }} />
    </Tabs>
  );
}