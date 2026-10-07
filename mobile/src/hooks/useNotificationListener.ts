import { useEffect, useRef } from 'react';
import { Linking } from 'react-native';
import { router } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from '@/src/lib/notifications';

const handleNotificationPress = async (targetUrl?: string) => {
  if (!targetUrl) return;

  // 1. External Web URL -> Open in system browser
  if (targetUrl.startsWith('http://') || targetUrl.startsWith('https://')) {
    const supported = await Linking.canOpenURL(targetUrl);
    if (supported) {
      await Linking.openURL(targetUrl);
    }
  }
  // 2. Internal App Path -> Navigate via Expo Router
  else if (targetUrl.startsWith('/')) {
    router.push(targetUrl as any);
  }
};

export function useNotificationListener(isLoaded: boolean, isSignedIn: boolean, syncPushToken: (token: string) => Promise<any>) {
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    // Register push token
    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        console.log('Expo Push Token:', token);
        syncPushToken(token).catch((error) => {
          console.error('Error syncing push token:', error);
        });
      }
    });

    // Foreground listener
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification Received:', notification);
    });

    // User tap listener
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const targetUrl = response.notification.request.content.data?.url;

      if (typeof targetUrl === 'string' && targetUrl.trim() !== '') {
        handleNotificationPress(targetUrl).catch((error) => {
          console.error('Error handling notification press:', error);
        });
      }
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [isLoaded, isSignedIn, syncPushToken]);
}