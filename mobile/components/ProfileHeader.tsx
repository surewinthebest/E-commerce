import { View, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Color } from '@/models/Color'
import { Ionicons } from '@expo/vector-icons'
import SafeScreen from './SafeScreen'
import AppText from './AppText'
import { Typography } from '@/models/Font'
import { router } from 'expo-router'

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Color.Black,
    },
    container: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    headerText: {
        color: Color.White,
        paddingLeft: 10
    },
    borderline: {
        borderColor: Color.ProfileGray,
        borderWidth: 1,
        marginHorizontal: -25,
        marginTop: 10
    }
})

interface Props {
    screenTitle: string,
    children: React.ReactNode
    extraText?: React.ReactNode
}

const ProfileHeader: React.FC<Props> = props => {
    const { screenTitle, children, extraText } = props;
    return (
        <View style={styles.screen}>
            <SafeScreen>
                {extraText ?
                    (<View style={styles.container}><View style={styles.headerContainer}>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={20} color={Color.White} />
                        </TouchableOpacity>

                        <AppText style={styles.headerText} typography={Typography.text2XlB}>{screenTitle}</AppText>
                    </View>
                        {/* <AppText style={styles.headerText} typography={Typography.textXs}>{extraText}</AppText> */}
                        {extraText}
                    </View>)
                    : (<View style={styles.headerContainer}>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={20} color={Color.White} /></TouchableOpacity>
                        <AppText style={styles.headerText} typography={Typography.text2XlB} numberOfLines={1} ellipsizeMode='tail'>{screenTitle}</AppText>
                    </View>)}
                <View style={styles.borderline}></View>
                {children}
            </SafeScreen>
        </View>
    )
}

export default ProfileHeader