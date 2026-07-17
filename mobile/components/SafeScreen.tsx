import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const styles = StyleSheet.create({
  safeScreen: {
    flex: 1,
    paddingHorizontal: 25,
  }
});

const SafeScreen = ({ children }: { children: React.ReactNode }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.safeScreen, { paddingTop: insets.top, }]}>
      {children}
    </View>
  );
};

export default SafeScreen;