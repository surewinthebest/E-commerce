import { StyleSheet, View, Modal, TouchableOpacity, ActivityIndicator, ScrollView, Alert, Pressable } from 'react-native'
import React, { useCallback, useMemo, useState } from 'react'
import SafeScreen from './SafeScreen'
import { Color } from '@/models/Color';
import AppText from './AppText';
import { Typography } from '@/models/Font';
import { Ionicons } from '@expo/vector-icons';
import { Address, CartItem, ShippingAddress } from '@/types';
import useAddresses from '@/hooks/useAddresses';

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: Color.Black + "90",
        justifyContent: "flex-end",
    },
    content: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: Color.Black,
        padding: 20,
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: 20
    },
    headerText: {
        color: Color.White,
        marginBottom: 20
    },
    onCloseContainer: {
        borderRadius: 50,
        width: 30,
        height: 30,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Color.Grey + "20"
    },
    borderline: {
        borderWidth: 1,
        borderColor: Color.ProfileGray,
        marginVertical: 10,
        marginHorizontal: -20
    },
    loadingContainer: {
        alignItems: "center",
        justifyContent: "center"
    },
    addressCard: {
        flexDirection: "column",
        padding: 10,
        marginTop: 20,
        borderRadius: 10,
        backgroundColor: Color.ProfileGray,
        borderWidth: 1
    },
    addressHeaderContainer: {
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
    continueBtn: {
        marginVertical: 15,
        height: 60,
        backgroundColor: Color.Green,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center"
    },
    continueBtnText: {
        color: Color.Black,
    }
})

interface Props {
    id: string;
    visible: boolean;
    addressList: Address[];
    isLoadingAddresses: boolean;
    onClose: () => void;
    onPressContinue: (addr: ShippingAddress) => void;
}

const AddressSelectModal: React.FC<Props> = props => {
    const { id, visible, addressList, isLoadingAddresses, onClose, onPressContinue } = props;
    const [shippingAddress, setShippingAddress] = useState<string>("");

    const reorderedAddressList = useMemo<Address[] | null>(() => {
        if (!addressList || addressList.length === 0) return null;
        const defaultAddress: Address = addressList.filter((addr) => addr.isDefault)[0];
        if (!defaultAddress) return addressList;
        const selectedIndex = addressList.findIndex(addr => addr.isDefault);
        const remainingAddressList = addressList.toSpliced(selectedIndex, 1);
        return [defaultAddress, ...remainingAddressList];
    }, [])

    const handleOnPressContinue = useCallback(() => {
        if (shippingAddress === "") {
            Alert.alert("Error",
                "No Shipping Address selected",
                [{ text: "OK", style: "default" }]);
            return;
        }
        const selected: Address = addressList.filter((addr) => addr._id === shippingAddress)[0];
        if (!selected) return;
        const selectedAddress: ShippingAddress = {
            fullName: selected.fullName,
            streetAddress: selected.streetAddress,
            city: selected.city,
            state: selected.state,
            zipCode: selected.zipCode,
            phoneNumber: selected.phoneNumber,
        }
        onPressContinue(selectedAddress);
    }, [shippingAddress])

    return (
        <Modal key={id} visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={[styles.content, { height: addressList.length > 1 ? 550 : 400 }]}>
                    <View style={styles.headerContainer}>
                        <AppText style={styles.headerText} typography={Typography.textXlB}>{"Select Address"}</AppText>
                        <TouchableOpacity style={styles.onCloseContainer} onPress={() => onClose()}>
                            <Ionicons name="close" color={Color.White} size={20} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.borderline}></View>

                    {/* Address List */}
                    <ScrollView>
                        {isLoadingAddresses ?
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={Color.Grey} />
                            </View>
                            : reorderedAddressList?.map((addr) => {
                                return <Pressable
                                    key={addr._id}
                                    style={[styles.addressCard, { borderColor: shippingAddress === addr._id ? Color.Green : Color.ProfileGray }]}
                                    onPress={() => { setShippingAddress(addr._id) }}>
                                    <View style={styles.addressHeaderContainer}>
                                        <View style={styles.labelContainer}>
                                            <View style={styles.labelIconBg}>
                                                <Ionicons name="location" size={30} color={Color.Green} />
                                            </View>
                                            <AppText style={styles.labelText} typography={Typography.textSmB}>{"  " + addr.label}</AppText>
                                        </View>
                                        {!!addr.isDefault ? <View style={styles.defaultLabel}>
                                            <AppText style={styles.defaultText} typography={Typography.text2XsB}>{"Default"}</AppText>
                                        </View> : null}
                                    </View>
                                    <View style={styles.contentContainer}>
                                        <AppText style={styles.fullnameText} typography={Typography.textSmB}>{addr.fullName}</AppText>
                                        <AppText style={styles.addressText} typography={Typography.textXs}>{addr.streetAddress}</AppText>
                                        <AppText style={styles.addressText} typography={Typography.textXs}>{addr.city}, {addr.state} {addr.zipCode}</AppText>
                                        <AppText style={styles.phoneText} typography={Typography.textXs}>{addr.phoneNumber}</AppText>
                                    </View>
                                </Pressable>
                            })}
                    </ScrollView>
                    <View style={styles.borderline}></View>

                    <TouchableOpacity style={styles.continueBtn} onPress={() => handleOnPressContinue()} disabled={!shippingAddress}>
                        {isLoadingAddresses ? <ActivityIndicator size="small" color={Color.ProfileGray} />
                            : <AppText style={styles.continueBtnText} typography={Typography.textBaseB}>{"Continue to Payment →"}</AppText>}

                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default React.memo(AddressSelectModal);