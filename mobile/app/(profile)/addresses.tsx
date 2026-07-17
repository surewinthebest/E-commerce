import { View, FlatList, ListRenderItem, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import ProfileHeader from '@/components/ProfileHeader';
import useAddresses from '@/hooks/useAddresses';
import { Address } from '@/types';
import AdressCard from '@/components/AdressCard';
import { Ionicons } from '@expo/vector-icons';
import { Color } from '@/models/Color';
import AppText from '@/components/AppText';
import { Typography } from '@/models/Font';
import AddressForm from '@/components/AddressForm';

const styles = StyleSheet.create({
    scrollView: {
        flex: 1
    },
    flatlist: {
        flex: 1
    },
    flatlistFooter: {
        paddingBottom: 5
    },
    emptyView: {
        marginTop: "75%",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column"
    },
    noAddressTitle: {
        paddingTop: 15,
        color: Color.White
    },
    noAddressContent: {
        paddingTop: 5,
        color: Color.Grey
    },
    addAddressBtn: {
        width: 140,
        height: 47,
        backgroundColor: Color.Green,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        marginTop: 20
    },
    addAddressBtnText: {
        color: Color.Black
    },
    addBtnContainer: {
        height: 50,
        backgroundColor: Color.Green,
        borderRadius: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20
    },
    btnIcon: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: Color.Black,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
    }
})

const addressesScreen = () => {
    const { addresses, isLoading, addAddress, isAddingAddress, updateAddress, isUpdatingAddress, deleteAddress, isDeletingAddress } = useAddresses();
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingId, setEditingId] = useState("");
    const [addressForm, setAddressForm] = useState({
        label: "",
        fullName: "",
        streetAddress: "",
        city: "",
        state: "",
        zipCode: "",
        phoneNumber: "",
        isDefault: false,
    });

    const renderItem = useCallback<ListRenderItem<Address>>(({ item }) => {
        return <AdressCard
            item={item}
            handleEdit={handleEditAddress}
            handleDelete={() => onDelete(item._id)}
            isUpdatingAddress={isUpdatingAddress}
            isDeletingAddress={isDeletingAddress} />
    }, []);

    const renderFooter = useCallback(() => {
        return <TouchableOpacity style={styles.addBtnContainer} onPress={() => handleAddAddress()}>
            <View style={styles.btnIcon}>
                <Ionicons name="add" color={Color.Black} size={15} />
            </View>
            <AppText style={styles.addAddressBtnText} typography={Typography.textSmB}>{"   Add New Address"}</AppText>
        </TouchableOpacity>
    }, [])

    const onDelete = (id: string) => {
        Alert.alert("Delete Address", "Are you sure to delete this address?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: () => deleteAddress(id)
            }
        ])
    }

    const onSave = () => {
        if (editingId) {
            updateAddress({ addressId: editingId, addressData: addressForm }, {
                onSuccess: () => {
                    Alert.alert("Success", "Address updated successfully", [
                        {
                            text: "OK",
                            onPress: () => setShowAddressForm(false)
                        }
                    ]);

                },
                onError: (error: any) => {
                    Alert.alert("Error", error?.response?.data?.error || "Fail to update address")
                }
            })
        } else {
            addAddress(addressForm, {
                onSuccess: () => {
                    Alert.alert("Success", "Address added successfully", [
                        {
                            text: "OK",
                            onPress: () => setShowAddressForm(false)
                        }
                    ]);

                },
                onError: (error: any) => {
                    Alert.alert("Error", error?.response?.data?.error || "Fail to add address")
                }
            })
        }
    }


    const onClose = () => {
        setEditingId("");
        setAddressForm({
            label: "",
            fullName: "",
            streetAddress: "",
            city: "",
            state: "",
            zipCode: "",
            phoneNumber: "",
            isDefault: false,
        });
        setShowAddressForm(false);
    }

    const handleAddAddress = () => {
        setEditingId("");
        setAddressForm({
            label: "",
            fullName: "",
            streetAddress: "",
            city: "",
            state: "",
            zipCode: "",
            phoneNumber: "",
            isDefault: false,
        });
        setShowAddressForm(true);
    }

    const handleEditAddress = (address: Address) => {
        setEditingId(address._id);
        setAddressForm({
            label: address.label,
            fullName: address.fullName,
            streetAddress: address.streetAddress,
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
            phoneNumber: address.phoneNumber,
            isDefault: address.isDefault,
        });
        setShowAddressForm(true);
    }

    return (
        <ProfileHeader screenTitle={"My Addresses"}>
            <FlatList
                keyExtractor={(item) => item._id}
                style={styles.flatlist}
                data={addresses}
                renderItem={renderItem}
                ListEmptyComponent={
                    <View style={styles.emptyView}>
                        <Ionicons name="location-outline" color={Color.Grey + "80"} size={77} />
                        <AppText style={styles.noAddressTitle} typography={Typography.textBaseB}>{"No address yet"}</AppText>
                        <AppText style={styles.noAddressContent} typography={Typography.textSm}>{"Add your first delivery address"}</AppText>
                        <TouchableOpacity style={styles.addAddressBtn} onPress={() => handleAddAddress()}>
                            <AppText style={styles.addAddressBtnText} typography={Typography.textSmB}>{"Add Address"}</AppText>
                        </TouchableOpacity>
                    </View>
                }
                ListFooterComponent={addresses?.length !== 0 ? renderFooter : null}
                contentContainerStyle={styles.flatlistFooter}
            />
            <AddressForm
                key={editingId}
                showAddressForm={showAddressForm}
                addressForm={addressForm}
                isEditing={!!editingId}
                isAddingAddress={isAddingAddress}
                isUpdatingAddress={isUpdatingAddress}
                onFormChange={setAddressForm}
                onSave={onSave}
                onClose={onClose} />
        </ProfileHeader>
    )
};

export default addressesScreen;