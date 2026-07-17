import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import AppText from './AppText';
import { Color } from '@/models/Color';
import { Typography } from '@/models/Font';
import useCart from '@/hooks/useCart';

const styles = StyleSheet.create({
    summaryContainer: {
        height: 160,
        padding: 17,
        flexDirection: "column",
        backgroundColor: Color.DarkGray,
        borderRadius: 20
    },
    header: {
        color: Color.White,
    },
    subheaderContainer: {
        paddingTop: 15
    },
    subheader: {
        color: Color.Grey,
    },
    subheaderPrice: {
        color: Color.White,
    },
    priceContainer: {
        paddingTop: 3,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    totalContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: 15,
    },
    totalHeader: {
        color: Color.White,
    },
    totalPrice: {
        color: Color.Green,
    }
})

const CartSummaryCard = () => {

    const { cartTotal: subtotal, shipping, tax, total } = useCart();

    const summary = [
        { name: "Subtotal", value: `$${subtotal.toFixed(2)}` },
        { name: "Shipping", value: `$${shipping.toFixed(2)}` },
        { name: "Tax", value: `$${tax.toFixed(2)}` }
    ]
    return (
        <View style={styles.summaryContainer}>
            <AppText style={styles.header} typography={Typography.textBaseB}>Summary</AppText>

            <View style={styles.subheaderContainer}>
                {summary.map((s) => {
                    return (<View key={s.name} style={styles.priceContainer}>
                        <AppText style={styles.subheader} typography={Typography.textXs}>{s.name}</AppText>
                        <AppText style={styles.subheaderPrice} typography={Typography.textXsB}>{s.value}</AppText>
                    </View>)
                })}</View>

            <View style={styles.totalContainer}>
                <AppText style={styles.totalHeader} typography={Typography.textSmB}>Total</AppText>
                <AppText style={styles.totalPrice} typography={Typography.textBaseB}>${total.toFixed(2)}</AppText>
            </View>
        </View>
    )
};

export default CartSummaryCard;