// src/hooks/usePushNotifications.ts
import { useState, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PUSH_TOKEN_STORAGE_KEY = '@expo_push_token';

export default function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>(undefined);
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);

  useEffect(() => {
    registerForPushNotificationsAsync().then(async token => {
      setExpoPushToken(token);
      if (token) {
        await AsyncStorage.setItem(PUSH_TOKEN_STORAGE_KEY, token);
        // Optionally send token to your backend here
        // await fetch('https://your-backend.com/register-token', { method: 'POST', body: JSON.stringify({ token }) });
      }
    });

    // Listen for incoming notifications while app is foregrounded
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      // Handle when user taps notification
      console.log('Notification tapped:', response);
    });

    return () => {
      subscription.remove();
      responseSubscription.remove();
    };
  }, []);

  return { expoPushToken, notification };
}

async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    Alert.alert('Push notifications require a physical device.');
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    Alert.alert('Failed to get push token for push notification!');
    return;
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
  if (!projectId) {
    Alert.alert('Project ID not found. Run `eas build:configure` first.');
    return;
  }

  try {
    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    console.log('Expo push token:', token);
    return token;
  } catch (error) {
    console.error('Error getting push token:', error);
  }
}