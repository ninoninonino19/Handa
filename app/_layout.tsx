// app/_layout.tsx
import { Stack } from 'expo-router';
import { HazardProvider } from '../src/context/HazardContext';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
// import * as Notifications from 'expo-notifications';
// import usePushNotifications from '../src/hooks/usePushNotifications';

/*Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,   // required by the type
    shouldShowList: true,     // required by the type
  }),
});
*/

export default function RootLayout() {
  // This initialises push notifications and gets the token
  //usePushNotifications();

  return (
    <SafeAreaProvider>
      <HazardProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top', 'bottom']}>
          <StatusBar style="auto" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          </Stack>
        </SafeAreaView>
      </HazardProvider>
    </SafeAreaProvider>
  );
}