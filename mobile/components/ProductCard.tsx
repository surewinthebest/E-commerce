import { View, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from "react-native";
import React from "react";
import AppText from "@/components/AppText";
import { Product } from "@/types";
import { Typography } from "@/models/Font";
import { Ionicons } from "@expo/vector-icons";
import { Color } from "@/models/Color";
import useCart from "@/hooks/useCart";
import useWishlist from "@/hooks/useWishlist";

const styles = StyleSheet.create({
    container: {
        width: 170,
        height: 270,
        marginHorizontal: 7,
        borderRadius: 20,
        backgroundColor: Color.DarkGray
    },
    wishlistContainer: {
        position: "relative",
        overflow: "hidden"
    },
    image: {
        height: 150,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
    },
    wishlist: {
        width: 30,
        height: 30,
        position: "absolute",
        top: 10,
        left: 130,
        borderRadius: 50,
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        alignItems: "center",
        justifyContent: "center",
    },
    contentContainer: {
        padding: 10,
        justifyContent: "flex-start",
    },
    contentText: {
        color: Color.White,
        padding: 2,
    },
    totalReviews: {
        color: Color.White,
        left: 1,
        top: 2
    },
    ratingContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        padding: 2,
    },
    ratingStar: {
        top: 2
    },
    rating: {
        color: Color.White,
        right: 2,
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    price: {
        color: Color.Green
    },
    addToCartBtn: {
        bottom: 2,
        width: 35,
        height: 35,
        backgroundColor: Color.Green,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center"
    }
});

interface Props {
    product: Product
}

const ProductCard: React.FC<Props> = props => {
    const { product } = props;
    const { isAddingToCart, addToCart } = useCart();
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
        )
    }

    const { isExistInWishlist, toggleWishlist, isAddingToWishlist, isRemovingFromWishlist } = useWishlist();

    return (
        <TouchableOpacity style={styles.container}>
            <View style={styles.wishlistContainer}>
                <Image
                    source={{ uri: product.images[0] }}
                    style={styles.image} />

                <TouchableOpacity
                    style={styles.wishlist}
                    onPress={() => { toggleWishlist(product._id) }}
                    disabled={isAddingToWishlist || isRemovingFromWishlist}>
                    {(isAddingToWishlist || isRemovingFromWishlist) ?
                        <ActivityIndicator size="small" color={Color.White} />
                        : <Ionicons size={18}
                            name={isExistInWishlist(product._id) ? "heart" : "heart-outline"}
                            color={isExistInWishlist(product._id) ? Color.Red : Color.White} />}
                </TouchableOpacity>
            </View>
            <View style={styles.contentContainer}>
                <AppText style={styles.contentText} numberOfLines={1} ellipsizeMode="tail" typography={Typography.text2Xs}>{product.category}</AppText>
                <AppText style={styles.contentText} numberOfLines={2} ellipsizeMode="tail" typography={Typography.textXsB}>{product.name}</AppText>

                <View style={styles.ratingContainer}>
                    <AppText style={styles.ratingStar} typography={Typography.text2Xs}>⭐️</AppText>
                    <AppText style={styles.rating} typography={Typography.textXsB}> {product.averageRating}</AppText>
                    <AppText style={styles.totalReviews} typography={Typography.text2Xs}>({product.totalReviews})</AppText>
                </View>

                <View style={styles.priceContainer}>
                    <AppText style={styles.price} typography={Typography.textXlB}>${product.price}</AppText>
                    <TouchableOpacity
                        onPress={() => { handleAddToCart(product._id, product.name) }}
                        style={styles.addToCartBtn}
                        disabled={isAddingToCart}
                    >
                        {isAddingToCart
                            ?
                            <ActivityIndicator size="small" color={Color.White} />
                            :
                            <Ionicons name="add" size={22} color={Color.Black} />}
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default ProductCard;