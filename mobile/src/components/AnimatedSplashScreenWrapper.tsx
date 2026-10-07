import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { Asset } from "expo-asset";
import LottieView from "lottie-react-native";
import { Color } from "@/models/Color";

// Keep static splash screen visible until Lottie starts
SplashScreen.preventAutoHideAsync().catch(() => {});

interface SplashScreenWrapperProps {
  children: React.ReactNode;
}

export default function SplashScreenWrapper({ children }: SplashScreenWrapperProps) {
  const [appReady, setAppReady] = useState(false);
  const [animationFinished, setAnimationFinished] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-cache essential static images into memory
        const imageAssets = [
          require("@/src/assets/images/icon.png"),
          require("@/src/assets/images/auth-image.png"),
          require("@/src/assets/images/google.png"),
          require("@/src/assets/images/apple.png"),
        ];

        const cacheImages = imageAssets.map((image) =>
          Asset.fromModule(image).downloadAsync()
        );

        await Promise.all([...cacheImages]);

      } catch (e) {
        console.warn("Error loading startup assets:", e);
      } finally {
        // Mark app as ready once all async tasks complete
        setAppReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appReady) {
      // Hide static OS splash screen once the container layout is ready
      await SplashScreen.hideAsync().catch(() => {});
    }
  }, [appReady]);

  if (!appReady) {
    return null;
  }

  // Render Lottie animation until it finishes playing
  if (!animationFinished) {
    return (
      <View style={styles.container} onLayout={onLayoutRootView}>
        <LottieView
          source={require("@/src/assets/animations/splash-animation.json")}
          autoPlay
          loop={false}
          onAnimationFinish={() => setAnimationFinished(true)}
          style={styles.lottie}
          resizeMode="contain"
        />
      </View>
    );
  }

  // Once animation completes, render the rest of the application
  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.White,
    alignItems: "center",
    justifyContent: "center",
  },
  lottie: {
    width: "80%",
    height: "80%",
  },
});