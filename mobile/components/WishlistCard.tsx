import { View, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import React, { useState } from 'react'
import { Product } from '@/types'
import { Color } from '@/models/Color'
import { Typography } from '@/models/Font'
import AppText from './AppText'
import { Ionicons } from '@expo/vector-icons'
import useWishlist from '@/hooks/useWishlist'
import useCart from '@/hooks/useCart'

const styles = StyleSheet.create({
    wishlistItemContainer: {
        width: "100%",
        padding: 12,
        marginBottom: 5,
        marginTop: 15,
        flexDirection: "column",
        borderRadius: 20,
        backgroundColor: Color.ProfileGray
    },
    imageContainer: {
        flexDirection: "row"
    },
    cartItemImage: {
        borderRadius: 10,
        width: "25%",
        height: "100%",
    },
    itemQuantity: {
        position: "absolute",
        height: 15,
        borderRadius: 20,
        top: 7,
        backgroundColor: Color.Green,
        alignItems: "center",
        justifyContent: "center"
    },
    itemQuantityText: {
        color: Color.Black,
        textAlign: "center"
    },
    contentContainer: {
        paddingTop: 2,
        paddingLeft: 15,
        flexDirection: "column",
    },
    contentHeaderContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    text: {
        width: "75%",
        color: Color.White
    },
    priceContainer: {
        paddingTop: 5
    },
    stockContainer: {
        paddingVertical: 5,
        flexDirection: "row",
        alignItems: "center"
    },
    stockPoint: {
        width: 7,
        height: 7,
        borderRadius: 50,
        backgroundColor: Color.Green
    },
    totalPrice: {
        color: Color.Green
    },
    eachPrice: {
        color: Color.Grey,
        left: 5
    },
    addToCartBtn: {
        height: 35,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Color.Green,
        borderRadius: 10,
        marginTop: 12
    },
    addToCartBtnText: {
        color: Color.Black
    },
    deleteBtn: {
        right: 40,
        width: 35,
        height: 35,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Color.ProfileRed + "20"
    }
})

interface Props {
    item: Product
}

const WishlistCard: React.FC<Props> = props => {
    const { item } = props;
    const { removeFromWishlist, isRemovingFromWishlist } = useWishlist();
    const [nameHeight, setNameHeight] = useState(0);
    const { addToCart, isAddingToCart } = useCart();

    const handleRemove = () => {
        Alert.alert("Remove Item", `Are you sure to remove ${item.name}?`, [
            { text: "Cancel", style: "cancel" },
            {
                text: "Remove",
                style: "destructive",
                onPress: () => removeFromWishlist(item._id),
            },
        ])
    }

    const handleAddToCart = (productId: string, productName: string) => {
        addToCart(
            { productId, quantity: 1 },
            {
                onSuccess: () => {
                    Alert.alert("Success", `${productName} added to cart!`);
                },
                onError: (error: any) => {
                    Alert.alert("Error", error?.response?.data?.error || "Failed to add to cart");
                }
            }
        );
        return 

    }

    return (
        <View key={item._id} style={[styles.wishlistItemContainer, { height: nameHeight + 130 }]}>
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: item.images[0] }}
                    style={styles.cartItemImage} />

                <View style={styles.contentContainer}>
                    <View style={styles.contentHeaderContainer} onLayout={e => setNameHeight(e.nativeEvent.layout.height)}>
                        <AppText style={styles.text} typography={Typography.textSmB} numberOfLines={2} ellipsizeMode="tail">{item.name}</AppText>
                    </View>
                    <View style={styles.priceContainer}>
                        <AppText style={styles.totalPrice} typography={Typography.textXlB}>{"$" + item.price.toFixed(2)}</AppText></View>
                    <View style={styles.stockContainer}>
                        <View style={styles.stockPoint} />
                        <AppText style={styles.totalPrice} typography={Typography.textXsB}>{" " + item.stock + " in stock"}</AppText>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleRemove()}
                    disabled={isRemovingFromWishlist}>
                    {isRemovingFromWishlist ?
                        <ActivityIndicator size="small" color={Color.White} />
                        : <Ionicons name="trash-bin-outline" size={17} color={Color.Red} />}
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                style={styles.addToCartBtn}
                onPress={() => handleAddToCart(item._id, item.name)}>
                <AppText
                    style={styles.addToCartBtnText}
                    typography={Typography.textSmB}>{"Add To Cart"}</AppText>
            </TouchableOpacity>
        </View>
    )
}

export default WishlistCard