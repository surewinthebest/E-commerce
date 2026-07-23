import { View, Image, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { CartItem } from '@/types'
import AppText from './AppText'
import { Typography } from '@/models/Font'
import { Color } from '@/models/Color'
import { Ionicons } from '@expo/vector-icons'
import useCart from '@/hooks/useCart'

const styles = StyleSheet.create({
    cartItemContainer: {
        width: "100%",
        height: 120,
        padding: 12,
        marginBottom: 5,
        marginTop: 5,
        flexDirection: "row",
        borderRadius: 20,
        backgroundColor: Color.DarkGray
    },
    imageContainer: {
        position: "relative",
        overflow: "hidden",
        width: "29%",
    },
    cartItemImage: {
        borderRadius: 10,
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
        top: 3,
        paddingLeft: 15,
        flexDirection: "column",
    },
    text: {
        color: Color.White
    },
    priceContainer: {
        paddingVertical: 5,
        flexDirection: "row",
        alignItems: "center"
    },
    totalPrice: {
        color: Color.Green
    },
    eachPrice: {
        color: Color.Grey,
        left: 5
    },
    quantityContainer: {
        paddingTop: 5,
        flexDirection: "row",
        alignItems: "center",
    },
    quantityShown: {
        width: 50,
        textAlign: "center",
        color: Color.White
    },
    addQuantityBtn: {
        width: 35,
        height: 35,
        left: 7,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Color.Green
    },
    deleteBtn: {
        left: 80,
        width: 30,
        height: 30,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 107, 107, 0.2)"
    }
})

interface Props {
    item: CartItem
}

const CartItemCard: React.FC<Props> = props => {
    const { item } = props;
    const [quantityWidth, setQuantityWidth] = useState(0);
    const { updateItemQuantity, removeCartItems, isUpdating, isRemoving } = useCart();

    const handleQuantityChange = (productId: string, currentQuantity: number, change: number) => {
        const newQuantity = currentQuantity + change;
        if (newQuantity < 1) return;
        updateItemQuantity({ productId, quantity: newQuantity });
    };

    const handleRemoveCartItems = (productId: string, productName: string) => {
        Alert.alert("Remove Item", `Remove ${productName} from cart?`, [
            { text: "Cancel", style: "cancel" },
            {
                text: "Remove",
                style: "destructive",
                onPress: () => removeCartItems(productId),
            },
        ]);
    }


    return (
        <View style={styles.cartItemContainer}>
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: item.product.images[0] }}
                    style={styles.cartItemImage} />
                <View style={[styles.itemQuantity, { width: quantityWidth + 5, left: -quantityWidth + 85 }]} >
                    <AppText onLayout={(e) => setQuantityWidth(e.nativeEvent.layout.width)} style={styles.itemQuantityText} typography={Typography.text2XsB}>x{item.quantity}</AppText>
                </View>
            </View>

            <View style={styles.contentContainer}>
                <AppText style={styles.text} typography={Typography.textSmB} numberOfLines={2} ellipsizeMode="tail">{item.product.name}</AppText>
                <View style={styles.priceContainer}>
                    <AppText style={styles.totalPrice} typography={Typography.textXlB}>{"$" + (item.product.price * item.quantity).toFixed(2)}</AppText>
                    <AppText style={styles.eachPrice} typography={Typography.textXs}>{"$" + item.product.price.toFixed(2)} {"each"}</AppText>
                </View>
                <View style={styles.quantityContainer}>
                    <TouchableOpacity
                        onPress={() => { handleQuantityChange(item.product._id, item.quantity, -1) }}
                        disabled={item.quantity === 1 || isUpdating}>
                        {isUpdating ?
                            <ActivityIndicator size="small" color={Color.White} />
                            : <Ionicons name="remove" size={18} color={Color.White} />}
                    </TouchableOpacity>
                    <AppText style={styles.quantityShown} typography={Typography.textXlB}>{item.quantity}</AppText>
                    <TouchableOpacity
                        style={styles.addQuantityBtn}
                        onPress={() => { handleQuantityChange(item.product._id, item.quantity, 1) }}
                        disabled={item.quantity === item.product.stock || isUpdating}>
                        {!!isUpdating ?
                            <ActivityIndicator size="small" color={Color.White} />
                            : <Ionicons name="add" size={18} color={Color.Black} />}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={() => handleRemoveCartItems(item.product._id, item.product.name)}
                        disabled={isRemoving}>
                        {!!isRemoving ?
                            <ActivityIndicator size="small" color={Color.White} />
                            : <Ionicons name="trash-bin-outline" size={15} color={Color.Red} />}
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    )
}

export default CartItemCard;