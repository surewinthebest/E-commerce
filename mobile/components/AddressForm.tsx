import { View, Modal, StyleSheet, TouchableOpacity, Pressable, ScrollView, Platform, KeyboardAvoidingView, Switch, ActivityIndicator, Alert } from 'react-native'
import React, { useState } from 'react'
import { Color } from '@/models/Color'
import AppText from './AppText'
import { Typography } from '@/models/Font'
import { Ionicons } from '@expo/vector-icons'
import SafeScreen from './SafeScreen'
import FormTextInput from './FormTextInput'
import { Address, AddressFormTextInput } from '@/types'
import useAddresses from '@/hooks/useAddresses'

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center"
    },
    content: {
        flex: 1,
        marginTop: 25,
        backgroundColor: Color.Black,
        marginHorizontal: -25,
        borderRadius: 12,
        padding: 25,

    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    headerText: {
        color: Color.White
    },
    borderline: {
        marginTop: 20,
        borderWidth: 1,
        borderColor: Color.DarkGray + "90",
        marginHorizontal: -25
    },
    isDefaultContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: Color.ProfileGray,
        borderRadius: 15,
        height: 45,
        marginTop: 20,
        paddingVertical: 7,
        paddingHorizontal: 16,
        width: "100%"
    },
    isDefaultAddressText: {
        color: Color.White
    },
    confirmBtn: {
        height: 50,
        borderRadius: 15,
        backgroundColor: Color.Green,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 25
    },
    btnText: {
        color: Color.Black
    }
})

interface AddressFormData {
    label: string;
    fullName: string;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    phoneNumber: string;
    isDefault: boolean;
}

interface Props {
    key: string;
    showAddressForm: boolean;
    addressForm: AddressFormData;
    isEditing: boolean;
    isAddingAddress: boolean;
    isUpdatingAddress: boolean;
    onFormChange: (form: AddressFormData) => void;
    onSave: () => void;
    onClose: () => void;
}

const AddressForm: React.FC<Props> = props => {

    const { key, showAddressForm, addressForm, isEditing, isAddingAddress, isUpdatingAddress, onFormChange, onSave, onClose } = props;

    const formInfos: AddressFormTextInput[] = [
        { label: "Label", placeholder: "e.g. Home, Work, Office", value: addressForm.label, action: (t: string) => onFormChange({ ...addressForm, label: t }) },
        { label: "Full Name", placeholder: "Enter your full name", value: addressForm.fullName, action: (t: string) => onFormChange({ ...addressForm, fullName: t }) },
        { label: "Street Address", placeholder: "Street address, apt/suite number", value: addressForm.streetAddress, action: (t: string) => onFormChange({ ...addressForm, streetAddress: t }) },
        { label: "City", placeholder: "e.g. New York", value: addressForm.city, action: (t: string) => onFormChange({ ...addressForm, city: t }) },
        { label: "State", placeholder: "e.g. NY", value: addressForm.state, action: (t: string) => onFormChange({ ...addressForm, state: t }) },
        { label: "ZIP Code", placeholder: "e.g. 10001", value: addressForm.zipCode, action: (t: string) => onFormChange({ ...addressForm, zipCode: t }) },
        { label: "Phone Number", placeholder: "+852 12345678", value: addressForm.phoneNumber, action: (t: string) => onFormChange({ ...addressForm, phoneNumber: t }) },
    ]

    return (
        <Modal key={key} visible={showAddressForm} animationType="slide" transparent onRequestClose={onClose}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.backdrop}
            >
                <SafeScreen>
                    <View style={styles.content} >
                        <View style={styles.headerContainer}>
                            <AppText style={styles.headerText} typography={Typography.textXlB}>{"Add New Address"}</AppText>
                            <TouchableOpacity onPress={() => onClose()}>
                                <Ionicons name="close" color={Color.Grey} size={30} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.borderline} />

                        <ScrollView>
                            {formInfos.map((formInfo) => {
                                return <FormTextInput formInfo={formInfo} />
                            })}
                            <View style={styles.isDefaultContainer}>
                                <AppText style={styles.isDefaultAddressText} typography={Typography.textSmB}>{"Set as default address"}</AppText>
                                <Switch
                                    style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
                                    value={!!addressForm.isDefault}
                                    onValueChange={(value) => onFormChange({ ...addressForm, isDefault: !!value })}
                                    thumbColor="white"
                                />
                            </View>

                            <TouchableOpacity
                                style={styles.confirmBtn}
                                activeOpacity={0.8}
                                onPress={() => onSave()}
                                disabled={isAddingAddress || isUpdatingAddress}
                            >
                                {isAddingAddress || isUpdatingAddress ? (
                                    <ActivityIndicator size="small" color="#121212" />
                                ) : (
                                    <AppText style={styles.btnText} typography={Typography.textBaseB}>
                                        {isEditing ? "Save Changes" : "Add Address"}
                                    </AppText>
                                )}
                            </TouchableOpacity>

                        </ScrollView>
                    </View>
                </SafeScreen>
            </KeyboardAvoidingView>
        </Modal>
    )
}

export default AddressForm;