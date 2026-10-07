// app/_layout.tsx
import config from "@/src/config/Config";
import { ClerkLoaded, ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { Stack } from "expo-router";
import * as Sentry from "@sentry/react-native";
import { StripeProvider } from "@stripe/stripe-react-native";
import {
  focusManager,
  QueryClientProvider,
} from "@tanstack/react-query";
import { NetworkProvider, useNetwork } from '@/src/context/NetworkContext';
import { useMemo } from "react";
import { AppState, AppStateStatus, Platform } from "react-native";
import usePushNotification from "../hooks/usePushNotification";
import SplashScreenWrapper from "../components/AnimatedSplashScreenWrapper";
import { CartProvider } from "../context/CartContext";
import { NetworkStatusBanner } from "../components/NetworkStatusBanner";
import { useNotificationListener } from "../hooks/useNotificationListener";
import { createQueryClient } from "../lib/queryClient";

Sentry.init({
  dsn: config.SentryDsn,
  sendDefaultPii: true,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration()],
});

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

AppState.addEventListener("change", onAppStateChange);

// Child layout executed inside Providers
function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const { syncPushToken } = usePushNotification();

  useNotificationListener(isLoaded, !!isSignedIn, syncPushToken);

  return <Stack screenOptions={{ headerShown: false }} />;
}

// Main App Content with safely scoped React Query Client
function AppContent() {
  const { setIsServerDown } = useNetwork();

  const queryClient = useMemo(
    () => createQueryClient({ onServerError: setIsServerDown }),
    [setIsServerDown]
  );

  return (
    <ClerkProvider publishableKey={config.ExpoPublicClerkPublishableKey!} tokenCache={tokenCache}>
      <ClerkLoaded>
        <QueryClientProvider client={queryClient}>
          <CartProvider>
            <StripeProvider publishableKey={config.ExpoPublicStripePublishableKey!}>
              <NetworkStatusBanner />
              <InitialLayout />
            </StripeProvider>
          </CartProvider>
        </QueryClientProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}

const AppContentWithSentry = Sentry.wrap(AppContent);

// Standard React Component default export for Expo Router
export default function RootLayout() {
  return (
    <NetworkProvider>
      <SplashScreenWrapper>
        <AppContentWithSentry />
      </SplashScreenWrapper>
    </NetworkProvider>
  );
};