import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'
import { Address } from '@/types'
import { Color } from '@/models/Color'
import AppText from './AppText'
import { Ionicons } from '@expo/vector-icons'
import { Typography } from '@/models/Font'

const styles = StyleSheet.create({
    cardContainer: {
        height: 220,
        backgroundColor: Color.ProfileGray,
        borderRadius: 20,
        padding: 15,
        flexDirection: "column",
        marginTop: 15
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    labelContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    labelIconBg: {
        backgroundColor: Color.Green + "20",
        borderRadius: 50,
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center"
    },
    defaultLabel: {
        borderRadius: 30,
        width: 60,
        height: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Color.Green
    },
    labelText: {
        paddingLeft: 5,
        color: Color.White
    },
    contentContainer: {
        paddingLeft: 5,
        color: Color.White
    },
    fullnameText: {
        paddingTop: 15,
        color: Color.White
    },
    defaultText: {
        color: Color.Black
    },
    addressText: {
        color: Color.Grey,
        paddingTop: 5
    },
    phoneText: {
        color: Color.Grey,
        paddingTop: 8
    },
    btnContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 15
    },
    editBtn: {
        width: "49%",
        height: 35,
        borderRadius: 10,
        backgroundColor: Color.Green + "20",
        alignItems: "center",
        justifyContent: "center",
    },
    deleteBtn: {
        width: "49%",
        height: 35,
        borderRadius: 10,
        backgroundColor: Color.Red + "20",
        alignItems: "center",
        justifyContent: "center"
    },
    editBtnText: {
        color: Color.Green
    },
    deleteBtnText: {
        color: Color.Red
    }
})

interface Props {
    item: Address;
    handleEdit: (address: Address) => void;
    handleDelete: (addressId: string) => void;
    isUpdatingAddress: boolean;
    isDeletingAddress: boolean;
}

const AdressCard: React.FC<Props> = props => {
    const { item, handleEdit, handleDelete, isUpdatingAddress, isDeletingAddress } = props;
    return (
        <View key={item._id} style={styles.cardContainer}>
            <View style={styles.headerContainer}>
                <View style={styles.labelContainer}>
                    <View style={styles.labelIconBg}>
                        <Ionicons name="location" size={30} color={Color.Green} />
                    </View>
                    <AppText style={styles.labelText} typography={Typography.textSmB}>{"  " + item.label}</AppText>
                </View>
                {!!item.isDefault ? <View style={styles.defaultLabel}>
                    <AppText style={styles.defaultText} typography={Typography.text2XsB}>{"Default"}</AppText>
                </View> : null}
            </View>
            <View style={styles.contentContainer}>
                <AppText style={styles.fullnameText} typography={Typography.textSmB}>{item.fullName}</AppText>
                <AppText style={styles.addressText} typography={Typography.textXs}>{item.streetAddress}</AppText>
                <AppText style={styles.addressText} typography={Typography.textXs}>{item.city}, {item.state} {item.zipCode}</AppText>
                <AppText style={styles.phoneText} typography={Typography.textXs}>{item.phoneNumber}</AppText>
            </View>
            <View style={styles.btnContainer}>
                <TouchableOpacity
                    onPress={() => handleEdit(item)}
                    style={styles.editBtn}
                    disabled={isUpdatingAddress}>
                    {isUpdatingAddress ?
                        <ActivityIndicator size="small" color={Color.Grey} />
                        : <AppText style={styles.editBtnText} typography={Typography.textXsB}>{"Edit"}</AppText>}
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleDelete(item._id)}
                    style={styles.deleteBtn}
                    disabled={isDeletingAddress}>
                    {isDeletingAddress ? <ActivityIndicator size="small" color={Color.Grey} />
                        : <AppText style={styles.deleteBtnText} typography={Typography.textXsB}>{"Delete"}</AppText>}
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default AdressCard;