import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import Ionicons from "@expo/vector-icons/Ionicons"; 
import LottieView from "lottie-react-native";
import { Color } from "@/src/models/Color";

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
        const imageAssets = [
          require("@/src/assets/images/icon.png"),
          require("@/src/assets/images/auth-image.png"),
          require("@/src/assets/images/google.png"),
          require("@/src/assets/images/apple.png"),
        ];

        const cacheImages = imageAssets.map((image) =>
          Asset.fromModule(image).downloadAsync()
        );

        const cacheFonts = Font.loadAsync(Ionicons.font);

        await Promise.all([...cacheImages, cacheFonts]);

      } catch (e) {
        console.warn("Error loading startup assets:", e);
      } finally {
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