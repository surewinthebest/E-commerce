import { View, StyleSheet, Switch, ScrollView, TouchableOpacity } from 'react-native'
import React, { ComponentProps, useEffect, useState } from 'react'
import ProfileHeader from '@/components/ProfileHeader';
import AppText from '@/components/AppText';
import { Typography } from '@/models/Font';
import { Color } from '@/models/Color';
import { Ionicons } from '@expo/vector-icons';

const styles = StyleSheet.create({
    scrollView: {
        flex: 1
    },
    header: {
        color: Color.White,
        paddingVertical: 15
    },
    functionContainer: {
        height: 65,
        flexDirection: "row",
        padding: 15,
        marginVertical: 10,
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: Color.ProfileGray,
        borderRadius: 10
    },
    contentIconContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconContainer: {
        width: 45,
        height: 45,
        borderRadius: 50,
        backgroundColor: Color.Green + "20",
        alignItems: "center",
        justifyContent: "center"
    },
    contentContainer: {
        flexDirection: "column",
        paddingLeft: 10
    },
    title: {
        color: Color.White
    },
    description: {
        paddingTop: 5,
        color: Color.Grey
    },
    deleteAcctContainer: {
        height: 75,
        flexDirection: "row",
        padding: 15,
        marginVertical: 10,
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: Color.ProfileGray,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Color.Red + "70"
    },
    deleteIconContainer: {
        width: 45,
        height: 45,
        borderRadius: 50,
        backgroundColor: Color.Red + "20",
        alignItems: "center",
        justifyContent: "center"
    },
    deleteTitle: {
        color: Color.Red
    },
    deleteDescription: {
        paddingTop: 5,
        color: Color.Grey
    },
    alertContainer: {
        height: 73,
        flexDirection: "row",
        padding: 10,
        paddingTop: 13,
        marginVertical: 15,
        marginBottom: 50,
        alignItems: "flex-start",
        justifyContent: "flex-start",
        backgroundColor: Color.Green + "20",
        borderRadius: 10
    },
    alertContent: {
        paddingLeft: 10,
        color: Color.Grey,
        width: "85%",
    }
})

interface settingFunction {
    id: string;
    icon: ComponentProps<typeof Ionicons>['name'];
    title: string;
    description: string;
    rightHandSidecomponent?: "navigation" | "toggle";
    value?: boolean;
}

interface settingScreen {
    header: string;
    fns: settingFunction[]
}

const PrivacyAndSecurity = () => {
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [biometricEnabled, setBiometricEnabled] = useState(false);
    const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(false);
    const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(false);
    const [marketingEmailsEnabled, setMarketingEmailsEnabled] = useState(false);
    const [shareDataEnabled, setShareDataEnabled] = useState(false);

    useEffect(() => {

    }, [])

    const securityFn: settingFunction[] = [
        {
            id: "password",
            icon: "lock-closed-outline" as const,
            title: "Change Password",
            description: "Update your account password",
            rightHandSidecomponent: "navigation"
        },
        {
            id: "two-factor",
            icon: "shield-checkmark-outline" as const,
            title: "Two-Factor Authentication",
            description: "Add an extra layer of security",
            rightHandSidecomponent: "toggle",
            value: twoFactorEnabled
        },
        {
            id: "biometric",
            icon: "finger-print-outline" as const,
            title: "Biometric Login",
            description: "Use Face ID or Touch ID",
            rightHandSidecomponent: "toggle",
            value: biometricEnabled
        }
    ];

    const privacyFn: settingFunction[] = [
        {
            id: "push-noti",
            icon: "notifications-outline" as const,
            title: "Push Notifications",
            description: "Receive push notifications",
            rightHandSidecomponent: "toggle",
            value: pushNotificationsEnabled
        },
        {
            id: "email",
            icon: "mail-outline" as const,
            title: "Email Notifications",
            description: "Receive order updates via email",
            rightHandSidecomponent: "toggle",
            value: emailNotificationsEnabled
        },
        {
            id: "marketing",
            icon: "megaphone-outline" as const,
            title: "Marketing Emails",
            description: "Receive promotional emails",
            rightHandSidecomponent: "toggle",
            value: marketingEmailsEnabled
        },
        {
            id: "share-data",
            icon: "analytics-outline" as const,
            title: "Share Usage Data",
            description: "Help us improve the app",
            rightHandSidecomponent: "toggle",
            value: shareDataEnabled
        }
    ];

    const accountSettings: settingFunction[] = [
        {
            id: "activity",
            icon: "time-outline",
            title: "Account Activity",
            description: "View recent login activity",
            rightHandSidecomponent: "navigation"
        },
        {
            id: "connect-devices",
            icon: "phone-portrait-outline",
            title: "Connected Devices",
            description: "Manage devices with access",
            rightHandSidecomponent: "navigation"
        },
        {
            id: "data-download",
            icon: "download-outline",
            title: "Download Your Data",
            description: "Get a copy of your data",
            rightHandSidecomponent: "navigation"
        },
    ];

    const settingFn: settingScreen[] = [
        { header: "Security", fns: securityFn },
        { header: "Privacy", fns: privacyFn },
        { header: "Account", fns: accountSettings },
    ]

    const onPressToggle = (id: string, value: boolean) => {
        switch (id) {
            case "two-factor":
                setTwoFactorEnabled(value);
                break;
            case "biometric":
                setBiometricEnabled(value);
                break;
            case "push-noti":
                setPushNotificationsEnabled(value);
                break;
            case "email":
                setEmailNotificationsEnabled(value);
                break;
            case "marketing":
                setMarketingEmailsEnabled(value);
                break;
            case "share-data":
                setShareDataEnabled(value);
                break;
        }
    };

    return (
        <ProfileHeader screenTitle={"Privacy & Security"}>
            <ScrollView style={styles.scrollView}>

                {settingFn.map((s) => {
                    return <>
                        <AppText style={styles.header} typography={Typography.textBaseB}>{s.header}</AppText>
                        {s.fns.map((fn) => {
                            return (<View key={fn.id} style={styles.functionContainer}>
                                <View style={styles.contentIconContainer}>
                                    <View style={styles.iconContainer}>
                                        <Ionicons name={fn.icon} color={Color.Green} size={25} />
                                    </View>
                                    <View style={styles.contentContainer}>
                                        <AppText style={styles.title} typography={Typography.textSmB}>{fn.title}</AppText>
                                        <AppText style={styles.description} typography={Typography.textXs}>{fn.description}</AppText>
                                    </View>
                                </View>
                                {fn.rightHandSidecomponent === "navigation" ?
                                    <Ionicons name="chevron-forward" color={Color.DarkGray} size={30} />
                                    : <Switch
                                        style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
                                        value={fn.value}
                                        onValueChange={(value) => onPressToggle(fn.id, value)}
                                        thumbColor="white"
                                    />}
                            </View>)
                        })}
                    </>
                })}

                {/* Delete Account */}
                <TouchableOpacity style={styles.deleteAcctContainer}>
                    <View style={styles.contentIconContainer}>
                        <View style={styles.deleteIconContainer}>
                            <Ionicons name="trash-outline" color={Color.Red} size={25} />
                        </View>
                        <View style={styles.contentContainer}>
                            <AppText style={styles.deleteTitle} typography={Typography.textSmB}>{"Delete Account"}</AppText>
                            <AppText style={styles.deleteDescription} typography={Typography.textXs}>{"Permanently delete your account"}</AppText>
                        </View>
                    </View>
                    <Ionicons name="chevron-forward" color={Color.Red} size={30} />
                </TouchableOpacity>

                {/* Alert Information */}
                <View style={styles.alertContainer}>
                    <Ionicons name="information-circle-outline" size={25} color={Color.Green} />
                    <AppText style={styles.alertContent} typography={Typography.textXs}>{"We take your privacy seriously. Your data is encrypted and stored securely. You can manage your privacy settings at any time."}</AppText>
                </View>

            </ScrollView>
        </ProfileHeader>
    )
};

export default PrivacyAndSecurity;