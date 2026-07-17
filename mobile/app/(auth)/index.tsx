import AppText from "@/components/AppText";
import useSocialAuth from "@/hooks/useSocialAuth";
import { Color } from "@/models/Color";
import { Typography } from "@/models/Font";
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";

const styles = StyleSheet.create({
  authScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgb(255, 255, 255)",
    paddingLeft: 2,
    paddingRight: 2,
  },
  authImage: {
    width: 350,
    height: 350,
  },
  btnView: {
    marginTop: 0.75,
    gap: 0.5,
  },
  btnContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 350,
    height: 50,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "rgb(209,213,219)",
    backgroundColor: "rgb(255,255,255)",
    marginTop: 10,
    paddingLeft: 1.5,
    paddingRight: 1.5,
    paddingTop: 0.5,
    paddingBottom: 0.5,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    elevation: 2, // this is for androi
  },
  btnfield: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  googleBtnImg: {
    width: 50,
    height: 50,
    marginRight: 0.75,
  },
  btnText: {
    color: Color.Black,
  },
  appleBtnImg: {
    width: 30,
    height: 30,
    marginRight: 15,
    left: 4,
  },
  textField: {
    marginTop: 20,
    marginLeft: 30,
    marginRight: 30,
    textAlign: "center",
    color: Color.Black,
  },
  termAndCondition: {
    color: Color.Blue,
  }
});

const AuthScreen = () => {
  const { loadingStrategy, handleSocialAuth } = useSocialAuth();

  return (
    <View style={styles.authScreen}>
      {/* DEMO IMAGE */}
      <Image
        source={require("../../assets/images/auth-image.png")}
        style={styles.authImage}
        resizeMode="contain"
      />

      <View style={styles.btnView}>
        {/* GOOGLE SIGN IN BTN */}
        <TouchableOpacity
          style={styles.btnContainer}
          onPress={() => handleSocialAuth("oauth_google")}
          disabled={loadingStrategy !== null}
        >
          {loadingStrategy === "oauth_google" ? (
            <ActivityIndicator size={"small"} color={"#4285f4"} />
          ) : (
            <View style={styles.btnfield}>
              <Image
                source={require("../../assets/images/google.png")}
                style={styles.googleBtnImg}
                resizeMode="contain"
              />
              <AppText style={styles.btnText} typography={Typography.textSm}>Continue with Google</AppText>
            </View>
          )}
        </TouchableOpacity>

        {/* APPLE SIGN IN BTN */}
        <TouchableOpacity
          style={styles.btnContainer}
          onPress={() => handleSocialAuth("oauth_apple")}
          disabled={loadingStrategy !== null}
        >
          {loadingStrategy === "oauth_apple" ? (
            <ActivityIndicator size={"small"} color={"#4285f4"} />
          ) : (
            <View style={styles.btnfield}>
              <Image
                source={require("../../assets/images/apple.png")}
                style={styles.appleBtnImg}
                resizeMode="contain"
              />
              <AppText style={styles.btnText} typography={Typography.textSm}>Continue with Apple</AppText>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <AppText style={styles.textField} typography={Typography.textXs}>
        By signing up, you agree to our <AppText style={styles.termAndCondition} typography={Typography.textXs}>Terms</AppText>
        {", "}
        <AppText style={styles.termAndCondition} typography={Typography.textXs}>Privacy Policy</AppText>
        {", and "}
        <AppText style={styles.termAndCondition} typography={Typography.textXs}>Cookie Use</AppText>
      </AppText>
    </View>
  );
};

export default AuthScreen;
