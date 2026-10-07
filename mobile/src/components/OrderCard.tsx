import { View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { OrderItem } from '@/src/types';
import AppText from './AppText';
import { Color } from '@/src/models/Color';
import { Typography } from '@/src/models/Font';
import { formatDate, getStatusColor } from '@/src/lib/utils';
import { Ionicons } from '@expo/vector-icons';

const styles = StyleSheet.create({
    orderContainer: {
        height: 200,
        borderRadius: 20,
        flexDirection: "column",
        padding: 20,
        marginTop: 20,
        backgroundColor: Color.ProfileGray
    },
    imageContainer: {
        flexDirection: "row",
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 10
    },
    imageContentContainer: {
        marginLeft: 15,
        flexDirection: "column",
    },
    orderId: {
        color: Color.White
    },
    createdAt: {
        color: Color.Grey,
        paddingTop: 5
    },
    statusContainer: {
        borderRadius: 30,
        padding: 5,
        height: 23,
        marginTop: 10,
        alignItems: "center",
        justifyContent: "center"
    },
    orderItemsContainer: {
        marginTop: 10,
        flexDirection: "column",
    },
    orderItems: {
        marginTop: 3,
        color: Color.Grey
    },
    totalItems: {
        marginTop: 15,
        color: Color.Grey
    },
    totalPrice: {
        marginTop: 5,
        color: Color.Green
    },
    ratingPriceContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    priceContainer: {
        flexDirection: "column",
    },
    ratingContainer: {
        borderRadius: 30,
        width: 130,
        height: 35,
        flexDirection: "row",
        backgroundColor: Color.Green,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15
    },
    ratingBtn: {
        marginLeft: 5,
        color: Color.Black
    }
})

interface Props {
    orderId: string;
    orderItems: OrderItem[];
    createdAt: string;
    status: string;
    totalPrice: string;
    hasReviewed: boolean;
    setShowReviewModal: (isShowed: boolean) => void;
    setReviewInfo: (orderId: string, orderItem: OrderItem[] | null) => void;
}

const OrderCard: React.FC<Props> = props => {
    const { orderId, orderItems, createdAt, status, totalPrice, hasReviewed, setShowReviewModal, setReviewInfo } = props;

    return (
        <View key={orderId} style={styles.orderContainer}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: orderItems[0].image }} style={styles.image} />
                <View style={styles.imageContentContainer}>
                    <AppText style={styles.orderId} typography={Typography.textSmB}>{"Order #" + orderId.slice(-8).toUpperCase()}</AppText>
                    <AppText style={styles.createdAt} typography={Typography.textXs}>{formatDate(createdAt)}</AppText>
                    <View style={[styles.statusContainer, { width: 9 * status.length, backgroundColor: getStatusColor(status) + "20" }]}>
                        <AppText style={{ color: getStatusColor(status) }} typography={Typography.text2XsB}>{status}</AppText>
                    </View>
                </View>
            </View>
            <View style={styles.orderItemsContainer}>
                {orderItems.map((item) => {
                    return <AppText key={item._id} style={styles.orderItems} typography={Typography.textXs}>{item.name + " x " + item.quantity}</AppText>
                })}
            </View>
            <View style={styles.ratingPriceContainer}>
                <View style={styles.priceContainer}>
                    <AppText style={styles.totalItems} typography={Typography.text2Xs}>{orderItems.length + " Items"}</AppText>
                    <AppText style={styles.totalPrice} typography={Typography.textXlB}>{"$" + totalPrice}</AppText>
                </View>
                {!hasReviewed && <TouchableOpacity
                    style={styles.ratingContainer}
                    onPress={() => {
                        setReviewInfo(orderId, orderItems);
                        setShowReviewModal(true);
                    }}>
                    <Ionicons name="star" color={Color.Black} size={20} />
                    <AppText style={styles.ratingBtn} typography={Typography.textXsB}>{"Leave Rating"}</AppText>
                </TouchableOpacity>}
            </View>
        </View >
    )
}

export default React.memo(OrderCard);