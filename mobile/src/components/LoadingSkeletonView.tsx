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
                    <Shimmer height={120} borderRadius={10} />
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
                <View style={{ flex: 1, marginLeft: 12 }}>
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
    <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 10 }}>
        {[1, 2, 3].map((key) => (
            <View key={key} style={skeletonStyles.orderCard}>
                <View style={skeletonStyles.spaceBetween}>
                    <Shimmer width="40%" height={16} />
                    <Shimmer width="25%" height={20} borderRadius={12} />
                </View>
                <Shimmer width="60%" height={14} style={{ marginTop: 12 }} />
                <Shimmer width="30%" height={16} style={{ marginTop: 12 }} />
            </View>
        ))}
    </ScrollView>
);

// ------------------- Addresses Skeleton -------------------
export const AddressSkeleton = () => (
    <View style={{ marginTop: 10 }}>
        {[1, 2].map((key) => (
            <View key={key} style={skeletonStyles.addressCard}>
                <Shimmer width="30%" height={18} />
                <Shimmer width="80%" height={14} style={{ marginTop: 10 }} />
                <Shimmer width="60%" height={14} style={{ marginTop: 6 }} />
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
    <View style={{ marginTop: 10 }}>
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
        backgroundColor: Color.DarkGray,
        padding: 10,
        borderRadius: 12,
    },
    cartCard: {
        flexDirection: 'row',
        backgroundColor: Color.DarkGray,
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
    },
    orderCard: {
        backgroundColor: Color.DarkGray,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    addressCard: {
        backgroundColor: Color.DarkGray,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    NotificationCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Color.DarkGray,
        padding: 12,
        borderRadius: 12,
        marginBottom: 10,
    },
    wishlistCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Color.DarkGray,
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
    },
    spaceBetween: { flexDirection: 'row', justifyContent: 'space-between' },
});