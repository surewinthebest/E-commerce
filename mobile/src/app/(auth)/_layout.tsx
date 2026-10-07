// app/(auth)/_layout.tsx
import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/expo";
import { useEffect, useState } from "react";
import { CacheManager, CACHE_KEYS } from "@/src/lib/cache";

export default function AuthRoutesLayout() {
  const auth = useAuth();
  
  // Guard against unmounted ClerkProvider during initial root mount
  const isLoaded = auth?.isLoaded ?? false;
  const isSignedIn = auth?.isSignedIn ?? false;

  // ⚡ Read MMKV synchronously on initial mount (0ms delay)
  const [hasCachedCart, setHasCachedCart] = useState(() => {
    return !!CacheManager.getObject(CACHE_KEYS.CART);
  });

  useEffect(() => {
    // When Clerk finishes background token verification
    if (isLoaded && !isSignedIn) {
      // If token expired or was revoked while app was in background
      Object.values(CACHE_KEYS).forEach((key) => CacheManager.remove(key));
      setHasCachedCart(false);
    }
  }, [isLoaded, isSignedIn]);

  // 🚀 If cached cart exists OR Clerk confirms session -> go straight to main app
  if (hasCachedCart || (isLoaded && isSignedIn)) {
    return <Redirect href="/(tabs)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}