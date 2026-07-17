import { Redirect, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@clerk/expo";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { StyleSheet } from "react-native";
import { Typography } from "@/models/Font";
import { textStyle } from "@/components/AppText";
import { Color } from "@/models/Color";

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    backgroundColor: "transparent",
    borderTopWidth: 0,
    paddingTop: 4,
    marginHorizontal: 100,
    borderRadius: 24,
    overflow: "hidden",
  }
})

const TabsLayout = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const insets = useSafeAreaInsets();

  if (!isLoaded) return null; // for a better ux
  if (!isSignedIn) return <Redirect href={"/(auth)"} />;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Color.Green,
        tabBarInactiveTintColor: Color.Grey,
        tabBarStyle: [styles.tabBarContainer,
        {
          height: 32 + insets.bottom,
          marginBottom: insets.bottom
        }],
        tabBarBackground: () => (
          <BlurView
            intensity={80}
            tint="dark"
            style={StyleSheet.absoluteFill}
          // StyleSheet.absoluteFill is equal to this 👇
          // { position: "absolute", top: 0, right: 0, left: 0, bottom: 0 }
          />
        ),
        tabBarLabelStyle: {
          fontSize: textStyle[Typography.textXsB].fontSize,
          fontWeight: textStyle[Typography.textXsB].fontWeight
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Shop",
          tabBarIcon: ({ color, size }) => <Ionicons name="grid" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, size }) => <Ionicons name="cart" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;