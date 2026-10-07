import { Color } from "@/src/models/Color";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback } from "react";
import { View, Modal, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback, Alert, ActivityIndicator } from "react-native";
import AppText from "./AppText";
import { Typography } from "@/src/models/Font";
import { OrderItem } from "@/src/types";
import useReviews from "@/src/hooks/useReviews";

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: Color.Black + "95",
        alignItems: "center",
        justifyContent: "center"
    },
    content: {
        backgroundColor: Color.ProfileGray,
        borderRadius: 20,
        width: 350,
        padding: 20,
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "column"
    },
    iconContainer: {
        width: 55,
        height: 55,
        borderRadius: 50,
        backgroundColor: Color.Green + "20",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        marginTop: 10,
        color: Color.White
    },
    description: {
        marginTop: 5,
        color: Color.Grey
    },
    orderItemContainer: {
        flexDirection: "row",
        marginTop: 40
    },
    orderItemImage: {
        width: 60,
        height: 60,
        borderRadius: 10
    },
    orderItemInfo: {
        marginLeft: 10,
        flexDirection: "column"
    },
    ratingContainer: {
        marginTop: 20,
        flexDirection: "row",
        right: 35
    },
    star: {
        margin: 7
    },
    submitBtn: {
        width: 300,
        height: 40,
        borderRadius: 10,
        backgroundColor: Color.Green,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20
    },
    cancelBtn: {
        marginTop: 20,
        color: Color.Grey
    }
})

interface Props {
    visible: boolean;
    orderItems: OrderItem[];
    orderId: string;
    ratingList: { [key: string]: number };
    onClose: (isShowed: boolean) => void;
    onRatingChange: (productId: string, rating: number) => void;
}

const ReviewModal: React.FC<Props> = props => {
    const { visible, orderItems, orderId, ratingList, onClose, onRatingChange } = props;
    const { createReviewAsync, isCreating: isSubmittingAllRatings } = useReviews();

    const onPressSubmit = useCallback(() => {
        try {
            orderItems.forEach((item) => {
                const createReviewData = {
                    productId: item.product._id,
                    orderId: orderId,
                    rating: ratingList[item.product._id]
                };
                createReviewAsync(createReviewData);
            });
            Alert.alert(
                "Success",
                "Submit all ratings successfully",
                [{ "text": "OK", "style": "default", "onPress": () => onClose(false) }]
            );
        } catch (error) {
            Alert.alert(
                "Error",
                `Fail to submit all ratings: ${error}`,
                [{ "text": "OK", "style": "default", "onPress": () => onClose(false) }]
            );
        }
    }, [createReviewAsync, onClose, orderId, orderItems, ratingList]);

    return (
        <Modal visible={visible} animationType="fade" transparent onRequestClose={() => onClose(false)}>
            <TouchableWithoutFeedback onPress={() => onClose(false)}>
                <View style={styles.backdrop}>
                    <TouchableWithoutFeedback>
                        <View style={[styles.content, { height: orderItems.length * 400, maxHeight: 600 }]}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="star" color={Color.Green} size={32} />
                            </View>
                            <AppText style={styles.title} typography={Typography.textXlB}>{"Rate Your Products"}</AppText>
                            <AppText style={styles.description} typography={Typography.textXs}>{"Rate each product from your order"}</AppText>
                            {orderItems.map((item) => {
                                return <View key={item._id} style={styles.orderItemContainer}>
                                    <Image source={{ uri: item.image }} style={styles.orderItemImage} />
                                    <View style={styles.orderItemInfo}>
                                        <AppText style={styles.title} typography={Typography.textXsB}>{item.name}</AppText>
                                        <AppText style={styles.description} typography={Typography.text2XsB}>{"Qty: " + item.quantity + "． $" + (item.price * item.quantity).toFixed(2)}</AppText>
                                        <View style={styles.ratingContainer}>
                                            {[1, 2, 3, 4, 5].map((star) => {
                                                const currentRating = ratingList[item.product._id];
                                                return <React.Fragment key={star}><TouchableOpacity style={styles.star} onPress={() => onRatingChange(item.product._id, star)}>
                                                    {currentRating >= star ? <Ionicons name="star" size={30} color={Color.Green} />
                                                        : <Ionicons name="star-outline" size={30} color={Color.Grey} />}
                                                </TouchableOpacity>
                                                </React.Fragment>
                                            })}
                                        </View>
                                    </View>
                                </View>
                            })}
                            <TouchableOpacity style={styles.submitBtn} onPress={() => onPressSubmit()}>
                                {isSubmittingAllRatings ? <ActivityIndicator size="small" />
                                    : <AppText typography={Typography.textXsB}>{"Submit All Ratings"}</AppText>}
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => onClose(false)}>
                                <AppText style={styles.cancelBtn} typography={Typography.text2XsB}>{"Cancel"}</AppText>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

export default React.memo(ReviewModal);