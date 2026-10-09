import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Shimmer from './Shimmer';
import { Color } from '@/src/models/Color';

// ------------------- Product / Shop Skeleton -------------------
export const ShopSkeleton = () => (
    <View style={skeletonStyles.container}>
        <View style={skeletonStyles.row}>
            {[1, 2].map((key) => (
                <View key={key} style={skeletonStyles.productCard}>
                    <Shimmer height={180} borderRadius={10} />
                    <Shimmer width="80%" height={16} style={{ marginTop: 10 }} />
                    <Shimmer width="40%" height={14} style={{ marginTop: 6 }} />
                </View>
            ))}
        </View>
        <View style={[skeletonStyles.row, { marginTop: 15 }]}>
            {[3, 4].map((key) => (
                <View key={key} style={skeletonStyles.productCard}>
                    <Shimmer height={120} borderRadius={10} />
                    <Shimmer width="80%" height={16} style={{ marginTop: 10 }} />
                    <Shimmer width="40%" height={14} style={{ marginTop: 6 }} />
                </View>
            ))}
        </View>
    </View>
);

// ------------------- Cart Items Skeleton -------------------
export const CartSkeleton = () => (
    <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 15 }}>
        {[1, 2, 3].map((key) => (
            <View key={key} style={skeletonStyles.cartCard}>
                <Shimmer width={70} height={70} borderRadius={10} />
                <View style={{ flex: 1, marginLeft: 12, marginTop: 5 }}>
                    <Shimmer width="70%" height={16} />
                    <Shimmer width="40%" height={14} style={{ marginTop: 8 }} />
                    <Shimmer width="30%" height={16} style={{ marginTop: 8 }} />
                </View>
            </View>
        ))}
    </ScrollView>
);

// ------------------- Orders Skeleton -------------------
export const OrdersSkeleton = () => (
    <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 20 }}>
        {[1, 2, 3].map((key) => (
            <View key={key} style={skeletonStyles.orderCard}>
                <View style={skeletonStyles.imageContainer}>
                    <Shimmer width="45%" height={80} borderRadius={12} />
                    <View style={{flexDirection: "column", right: 95, flex: 1}}>
                    <Shimmer width="60%" height={14} style={{ marginTop: 12 }} />
                    <Shimmer width="45%" height={10} style={{ marginTop: 12 }} />
                    <Shimmer width="40%" height={14} style={{ marginTop: 12 }} />
                    </View>
                </View>
                <Shimmer width="70%" height={14} style={{ marginTop: 15 }} />
                <Shimmer width="30%" height={16} style={{ marginTop: 12 }} />
                <View style={skeletonStyles.spaceBetween}>
                    <Shimmer width="40%" height={20} borderRadius={12} />
                    <Shimmer width="50%" height={20} borderRadius={12} style={{ left: 100 }} />
                </View>
            </View>
        ))}
    </ScrollView>
);

// ------------------- Addresses Skeleton -------------------
export const AddressSkeleton = () => (
    <View style={{ marginTop: 20 }}>
        {[1, 2].map((key) => (
            <View key={key} style={skeletonStyles.addressCard}>
                <Shimmer width="30%" height={18} />
                <Shimmer width="80%" height={14} style={{ marginTop: 10 }} />
                <Shimmer width="80%" height={14} style={{ marginTop: 10 }} />
                <Shimmer width="80%" height={14} style={{ marginTop: 10 }} />
                <Shimmer width="60%" height={14} style={{ marginTop: 10 }} />
            </View>
        ))}
    </View>
);

// ------------------- Notifications / Wishlist Skeleton -------------------
export const NotificationSkeleton = () => (
    <View style={{ marginTop: 10 }}>
        {[1, 2, 3, 4].map((key) => (
            <View key={key} style={skeletonStyles.NotificationCard}>
                <Shimmer width={40} height={40} borderRadius={20} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                    <Shimmer width="60%" height={16} />
                    <Shimmer width="85%" height={14} style={{ marginTop: 6 }} />
                </View>
            </View>
        ))}
    </View>
);

// ------------------- Wishlist Skeleton -------------------
export const WishlistSkeleton = () => (
    <View style={{ marginTop: 15 }}>
        {[1, 2, 3, 4].map((key) => (
            <View key={key} style={skeletonStyles.wishlistCard}>
                <Shimmer width={65} height={65} borderRadius={10} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                    <Shimmer width="65%" height={16} />
                    <Shimmer width="35%" height={14} style={{ marginTop: 6 }} />
                    <Shimmer width="25%" height={16} style={{ marginTop: 8 }} />
                </View>
                <Shimmer width={32} height={32} borderRadius={16} />
            </View>
        ))}
    </View>
);

const skeletonStyles = StyleSheet.create({
    container: { marginTop: 15 },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    productCard: {
        width: '48%',
        backgroundColor: Color.ProfileGray,
        padding: 15,
        borderRadius: 20,
    },
    cartCard: {
        flexDirection: 'row',
        backgroundColor: Color.ProfileGray,
        padding: 12,
        borderRadius: 12,
        marginBottom: 20,
    },
    orderCard: {
        backgroundColor: Color.ProfileGray,
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
    },
    addressCard: {
        backgroundColor: Color.ProfileGray,
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
    },
    NotificationCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Color.ProfileGray,
        padding: 12,
        borderRadius: 12,
        marginBottom: 20,
        height: 80
    },
    wishlistCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Color.ProfileGray,
        padding: 12,
        borderRadius: 12,
        marginBottom: 20,
    },
    spaceBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12
    },
    imageContainer: {
        flexDirection: 'row',
        marginTop: 12
    },
});