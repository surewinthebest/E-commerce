import { View, StyleSheet, TouchableOpacity } from 'react-native'
import React, { ComponentProps } from 'react'
import AppText from './AppText';
import { Ionicons } from '@expo/vector-icons';
import { Color } from '@/src/models/Color';
import { Typography } from '@/src/models/Font';
import SafeScreen from './SafeScreen';
import { router } from 'expo-router';

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: Color.Black
    },
    backBtn: {
        top: 60,
        left: 20,
        position: "absolute",
    },
    headerText: {
        position: "absolute",
        marginVertical: 50,
        marginLeft: 25,
        color: Color.White,
    },
    contentContainer: {
        top: 290,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        color: Color.White,
        paddingTop: 10
    },
    msg: {
        color: Color.Grey,
        paddingTop: 10
    }
})

interface Props {
    hasBackBtn: boolean;
    emptyHeader: string;
    emptyIcon: ComponentProps<typeof Ionicons>['name'];
    emptyTitle: string;
    emptyMsg: string;
}

const EmptyUI: React.FC<Props> = props => {
    const { hasBackBtn = false, emptyHeader, emptyIcon, emptyTitle, emptyMsg } = props;
    return (
        <View style={styles.screen}>
            <SafeScreen>
                {hasBackBtn && <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={20} color={Color.White} />
                </TouchableOpacity>}
                <AppText style={[styles.headerText, { left: hasBackBtn ? 20 : 0 }]} typography={Typography.text3XlB}>{emptyHeader}</AppText>
                <View style={styles.contentContainer}>
                    <Ionicons name={emptyIcon} size={60} color={Color.Grey} />
                    <AppText style={styles.title} typography={Typography.textBaseB}>{emptyTitle}</AppText>
                    <AppText style={styles.msg} typography={Typography.textSm}>{emptyMsg}</AppText>
                </View>
            </SafeScreen>
        </View>
    )
}

export default React.memo(EmptyUI);