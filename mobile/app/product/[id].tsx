import { View, Image, StyleSheet, Alert, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Product } from '@/types';
import SafeScreen from '@/components/SafeScreen';
import { Ionicons } from '@expo/vector-icons';
import { Color } from '@/models/Color';
import useWishlist from '@/hooks/useWishlist';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import AppText from '@/components/AppText';
import { Typography } from '@/models/Font';
import useCart from '@/hooks/useCart';
import useProduct from '@/hooks/useProduct';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Color.Black
    },
    scrollView: {
        position: "relative",
        overflow: "hidden",
        marginHorizontal: -25,
    },
    productImage: {
        width,
        height: width,
    },
    imageBtnContainer: {
        height: 50,
        width,
        position: "absolute",
        padding: 25,
        alignItems: "flex-start",
        justifyContent: "space-between",
        flexDirection: "row"
    },
    btn: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
        backgroundColor: Color.ProfileGray + "90"
    },
    imageIndicatorsContainer: {
        height: width + 70,
        width: width,
        position: "absolute",
        padding: 25,
        alignItems: "flex-end",
        justifyContent: "center",
        flexDirection: "row",
    },
    imageIndicator: {
        backgroundColor: Color.DarkGray,
        borderRadius: 50,
        width: 7,
        height: 7,
        marginHorizontal: 5
    },
    selectedImageIndicator: {
        backgroundColor: Color.Green,
        borderRadius: 30,
        width: 20,
        height: 7
    },
    catContainer: {
        marginTop: 20,
        borderRadius: 30,
        height: 20,
        backgroundColor: Color.Green + "20",
        alignItems: "center",
        justifyContent: "center"
    },
    catText: {
        color: Color.Green,
    },
    name: {
        color: Color.White,
        paddingTop: 10
    },
    ratingAndStockContainer: {
        flexDirection: "row",
        paddingTop: 10,
    },
    ratingContainer: {
        flexDirection: "row",
        borderRadius: 30,
        height: 35,
        backgroundColor: Color.ProfileGray,
        alignItems: "center",
        justifyContent: "center",
    },
    rating: {
        color: Color.White
    },
    review: {
        color: Color.Grey
    },
    stockContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 10
    },
    pointForm: {
        width: 7,
        height: 7,
        borderRadius: 50,
        backgroundColor: Color.Green
    },
    stock: {
        color: Color.Green,
        paddingLeft: 5
    },
    price: {
        marginTop: 5,
        color: Color.Green
    },
    quantityTitle: {
        color: Color.White,
        marginTop: 20
    },
    quantityContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10
    },
    deductBtn: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Color.ProfileGray,
        borderRadius: 50
    },
    addBtn: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Color.Green,
        borderRadius: 50
    },
    quantity: {
        width: 60,
        textAlign: "center",
        color: Color.White
    },
    descriptionTitle: {
        marginTop: 25,
        color: Color.White
    },
    descriptionContent: {
        paddingTop: 10,
        color: Color.Grey
    },
    borderline: {
        borderWidth: 1,
        borderColor: Color.ProfileGray
    },
    totalContainer: {
        height: 100,
        marginTop: 15,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    totalPriceContainer: {
        flexDirection: "column",
    },
    totalPriceLabel: {
        color: Color.Grey
    },
    totalPrice: {
        paddingTop: 5,
        color: Color.Green
    },
    addToCartBtn: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        backgroundColor: Color.Green,
        width: 160,
        height: 50
    },
    addToCartText: {
        paddingLeft: 5,
        color: Color.Black
    },
    errorUIContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    errorTitle: {
        color: Color.Grey
    },
    errorContent: {
        color: Color.Grey,
        paddingTop: 10
    },
    errorBtn: {
        width: 80,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Color.Green
    },
    errorBtnText: {
        color: Color.Black
    },
    loadingText: {
        color: Color.Grey
    },
    loadingContainer: {

    }
})

const ProductDetailScreen = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [imageHeight, setImageHeight] = useState<number[]>([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [catWidth, setCatWidth] = useState(0);
    const [reviewContainerWidth, setReviewContainerWidth] = useState(0);
    const { data: item, isError, isLoading } = useProduct(id);
    const { isExistInWishlist, addToWishlist, isAddingToWishlist, removeFromWishlist, isRemovingFromWishlist } = useWishlist();
    const { addToCart, isAddingToCart } = useCart();
    const wishlisted = isExistInWishlist(id);
    const insets = useSafeAreaInsets();

    const onPressWishlist = useCallback(() => {
        if (wishlisted) {
            removeFromWishlist(id, {
                onError: () => {
                    Alert.alert("Error", "Fail to remove from wishlist");
                }
            })
        } else {
            addToWishlist(id, {
                onError: () => {
                    Alert.alert("Error", "Fail to add to wishlist");
                }
            })
        }
    }, [])

    const onPressAddToCart = useCallback((productId: string, productName: string) => {
        addToCart({ productId, quantity }, {
            onSuccess: () => {
                Alert.alert("Success", `${productName} added to cart!`);
            },
            onError: (error: any) => {
                Alert.alert("Error", error?.response?.data?.error || "Failed to add to cart");
            }
        })
    }, [])

    useEffect(() => {
        if (!item) return;
    }, [])

    if (isLoading) return <LoadingUI />;
    if (isError || !item) return <ErrorUI />;

    const reviewUnit = item.totalReviews > 1 ? " reviews" : " review";

    const imageList = item.images || [];

    return (
        <View style={styles.screen}>
            <SafeScreen>
                <ScrollView
                    horizontal
                    pagingEnabled
                    style={styles.scrollView}
                    showsHorizontalScrollIndicator={false}
                    onScroll={(e) => {
                        const index = Math.round(e.nativeEvent.contentOffset.x / width);
                        setSelectedImageIndex(index);
                    }}
                >
                    {imageList.map((img) => {
                        return <Image style={styles.productImage} source={{ uri: img }} resizeMode='contain' />;
                    })}
                </ScrollView>

                <View style={[styles.imageBtnContainer, { paddingTop: insets.top + 15 }]}>
                    <TouchableOpacity style={styles.btn} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={20} color={Color.White} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btn} onPress={() => onPressWishlist()}>
                        {isAddingToWishlist || isRemovingFromWishlist ? (
                            <ActivityIndicator size="small" color={Color.White} />
                        ) : wishlisted ? <Ionicons name="heart" size={20} color={Color.Red} />
                            : <Ionicons name="heart-outline" size={20} color={Color.White} />}
                    </TouchableOpacity>
                </View>

                {/* Image Indicators */}
                <View style={styles.imageIndicatorsContainer}>
                    {imageList.map((_: any, index: number) => (
                        <View
                            key={index}
                            style={index === selectedImageIndex ? styles.selectedImageIndicator : styles.imageIndicator}
                        />
                    ))}
                </View>

                <ScrollView>
                    <View style={[styles.catContainer, { width: catWidth + 20 }]}>
                        <AppText style={styles.catText}
                            typography={Typography.text2XsB}
                            onLayout={(e) => setCatWidth(e.nativeEvent.layout.width)}>{item.category}</AppText>
                    </View>

                    <AppText style={styles.name} typography={Typography.text3XlB}>{item.name ?? "Name"}</AppText>

                    <View style={styles.ratingAndStockContainer}>
                        <View style={[styles.ratingContainer, { width: reviewContainerWidth + 60 }]}>
                            <AppText style={styles.rating} typography={Typography.textSmB}>{"⭐️ " + (item.averageRating ?? "0.0")}</AppText>
                            <AppText style={styles.review} typography={Typography.textXs} onLayout={(e) => setReviewContainerWidth(e.nativeEvent.layout.width)}>{"  (" + (item.totalReviews ?? "0") + reviewUnit + ")"}</AppText>
                        </View>
                        <View style={styles.stockContainer}>
                            <View style={styles.pointForm} />
                            <AppText style={styles.stock} typography={Typography.textXsB}>{(item.stock ?? "0") + " in stock"}</AppText>
                        </View>
                    </View>

                    <AppText style={styles.price} typography={Typography.text3XlB}>{"$ " + (item.price ?? 0).toFixed(2)}</AppText>

                    <AppText style={styles.quantityTitle} typography={Typography.textSmB}>{"Quantity"}</AppText>
                    <View style={styles.quantityContainer}>
                        <TouchableOpacity style={styles.deductBtn}
                            onPress={() => setQuantity(quantity - 1)}
                            disabled={quantity === 1}>
                            <Ionicons name="remove" size={20} color={Color.Grey} />
                        </TouchableOpacity>
                        <AppText style={styles.quantity}>{quantity}</AppText>
                        <TouchableOpacity style={styles.addBtn}
                            onPress={() => setQuantity(quantity + 1)}
                            disabled={quantity >= item?.stock}>
                            <Ionicons name="add" size={20} color={Color.Black} />
                        </TouchableOpacity>
                    </View>

                    <AppText style={styles.descriptionTitle} typography={Typography.textSmB}>{"Description"}</AppText>
                    <AppText style={styles.descriptionContent} typography={Typography.textSm}>{item.description ?? "Advanced fitness tracking, heart rate monitor, GPS, and water-resistant design. Stay connected with notifications and apps on your wrist."}</AppText>
                </ScrollView>

                <View style={styles.borderline}></View>
                <View style={styles.totalContainer}>
                    <View style={styles.totalPriceContainer}>
                        <AppText style={styles.totalPriceLabel} typography={Typography.textXs}>{"Total Price"}</AppText>
                        <AppText style={styles.totalPrice} typography={Typography.textXlB}>{"$" + ((item.price ?? 0) * quantity).toFixed(2)}</AppText>
                    </View>
                    <TouchableOpacity style={styles.addToCartBtn}
                        onPress={() => onPressAddToCart(item?._id, item?.name)}
                        disabled={isAddingToCart}>
                        <Ionicons name="cart" size={20} color={Color.Black} />
                        <AppText style={styles.addToCartText} typography={Typography.textSmB}>{"Add to cart"}</AppText>
                    </TouchableOpacity>
                </View>
            </SafeScreen >
        </View >
    )
}

export default ProductDetailScreen;

function ErrorUI() {
    return (
        <SafeScreen>
            <View style={styles.errorUIContainer}>
                <Ionicons name="alert-circle-outline" size={64} color={Color.Red} />
                <AppText style={styles.errorTitle} typography={Typography.textXlB} >{"Product not found"}</AppText>
                <AppText style={styles.errorContent} typography={Typography.textSm}>
                    {"This product may have been removed or doesn&apos;t exist"}
                </AppText>
                <TouchableOpacity
                    style={styles.errorBtn}
                    onPress={() => router.back()}
                >
                    <AppText style={styles.errorBtnText} typography={Typography.textSmB}>Go Back</AppText>
                </TouchableOpacity>
            </View>
        </SafeScreen>
    );
}

function LoadingUI() {
    return (
        <SafeScreen>
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Color.Grey} />
                <AppText style={styles.loadingText} typography={Typography.textSmB}>Loading product...</AppText>
            </View>
        </SafeScreen>
    );
}