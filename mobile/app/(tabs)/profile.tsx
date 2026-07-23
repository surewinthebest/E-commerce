import AppText from "@/components/AppText";
import SafeScreen from "@/components/SafeScreen";
import { Color } from "@/models/Color";
import { Typography } from "@/models/Font";
import { useAuth, useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { useCallback } from "react";
import { View, StyleSheet, Image, FlatList, ListRenderItem, TouchableOpacity, Alert } from "react-native";
import { Href, router } from "expo-router";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Color.Black
  },
  userContainer: {
    height: 110,
    flexDirection: "row",
    backgroundColor: Color.ProfileGray,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    marginTop: 5
  },
  userIcon: {
    width: 70,
    height: 70,
    borderRadius: 50,
    position: "relative"
  },
  userSignedIn: {
    width: 20,
    height: 20,
    borderRadius: 50,
    position: "absolute",
    backgroundColor: Color.Green,
    alignItems: "center",
    justifyContent: "center",
    left: 70,
    top: 70
  },
  userInfoContainer: {
    paddingLeft: 15
  },
  userInfoName: {
    color: Color.White
  },
  userInfoEmail: {
    color: Color.Grey,
    paddingTop: 5
  },
  actionContainer: {
    marginTop: 30
  },
  flatlistRow: {
    marginBottom: 12,
    justifyContent: "space-between"
  },
  profileBox: {
    width: 170,
    height: 130,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Color.ProfileGray
  },
  profileFnLogoBg: {
    width: 55,
    height: 55,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15
  },
  profileFnTitle: {
    color: Color.White
  },
  settingContainer: {
    marginTop: 15,
    flexDirection: "column"
  },
  btnContainer: {
    marginVertical: 10,
    height: 65,
    backgroundColor: Color.ProfileGray,
    borderRadius: 15,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    padding: 15
  },
  btnTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  btnText: {
    color: Color.White,
    textAlign: "center"
  },
  signOutBtnContainer: {
    borderColor: Color.ProfileRed + "30",
    borderWidth: 2,
    marginVertical: 15,
    height: 65,
    backgroundColor: Color.ProfileGray,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    padding: 20
  },
  signOutBtnText: {
    color: Color.ProfileRed,
    textAlign: "center"
  },
})

interface profileFunction {
  icon: any,
  title: string,
  color: string,
  direct: Href,
}

const ProfileScreen = () => {
  const { user } = useUser();
  const { signOut } = useAuth();

  const profileFunction: profileFunction[] = [
    { icon: "person-outline" as const, title: "Edit Profile", color: Color.ProfileBlue, direct: "/profile" },
    { icon: "list-outline" as const, title: "Orders", color: Color.ProfileGreen, direct: "/orders" },
    { icon: "location-outline" as const, title: "Addresses", color: Color.ProfileYellow, direct: "/addresses" },
    { icon: "heart-outline" as const, title: "Wishlist", color: Color.ProfileRed, direct: "/wishlist" },
  ];

  const renderItem = useCallback<ListRenderItem<profileFunction>>(({ item }) => {

    const handleRoute = () => {
      if (item.direct === "/profile") return;
      router.push(item.direct);
    }

    return (<TouchableOpacity key={item.title} style={styles.profileBox} onPress={() => handleRoute()}>
      <View style={[styles.profileFnLogoBg, { backgroundColor: item.color + "20" }]}>
        <Ionicons name={item.icon} size={27} color={item.color} />
      </View>
      <AppText style={styles.profileFnTitle} typography={Typography.textXsB}>{item.title}</AppText>
    </TouchableOpacity>)
  }, []);

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Do you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => signOut(),
      },
    ])
  }

  return (
    <View style={styles.screen}>
      <SafeScreen>
        {/* UserInfo */}
        <View style={styles.userContainer}>
          <Image style={styles.userIcon} source={{ uri: user?.imageUrl }} />
          <View style={styles.userSignedIn}>
            <Ionicons name="checkmark" size={16} color="#121212" />
          </View>
          <View style={styles.userInfoContainer}>
            <AppText style={styles.userInfoName} typography={Typography.textXlB}>{user?.fullName}</AppText>
            <AppText style={styles.userInfoEmail} typography={Typography.textXs}>{user?.emailAddresses[0].emailAddress}</AppText>
          </View>
        </View>

        {/* Profile Function */}
        <View style={styles.actionContainer}>
          <FlatList
            keyExtractor={(item) => item.title}
            data={profileFunction}
            renderItem={renderItem}
            numColumns={2}
            columnWrapperStyle={styles.flatlistRow}
          />
        </View>

        <View style={styles.settingContainer}>
          <TouchableOpacity style={styles.btnContainer}>
            <View style={styles.btnTextContainer}>
              <Ionicons name="notifications-outline" size={22} color={Color.White} />
              <AppText style={styles.btnText} typography={Typography.textSmB}>   Notifications</AppText></View>
            <Ionicons name="chevron-forward" size={20} color={Color.Grey} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnContainer}
            onPress={() => router.push("/PrivacyAndSecurity")}>
            <View style={styles.btnTextContainer}>
              <Ionicons name="shield-checkmark-outline" size={22} color={Color.White} />
              <AppText style={styles.btnText} typography={Typography.textSmB}>   Privacy & Security</AppText></View>
            <Ionicons name="chevron-forward" size={20} color={Color.Grey} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.signOutBtnContainer}
            onPress={() => handleSignOut()}>
            <View style={styles.btnTextContainer}>
              <Ionicons name="log-out-outline" size={22} color={Color.ProfileRed} />
              <AppText style={styles.signOutBtnText} typography={Typography.textSmB}>  Sign Out</AppText></View>
          </TouchableOpacity>
        </View>
      </SafeScreen>
    </View>
  );
};

export default ProfileScreen;