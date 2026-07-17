import { FlatList, ListRenderItem, ScrollView, StyleSheet } from 'react-native'
import React, { useCallback } from 'react'
import ProfileHeader from '@/components/ProfileHeader'
import { Typography } from '@/models/Font'
import { Color } from '@/models/Color'
import AppText from '@/components/AppText'
import useWishlist from '@/hooks/useWishlist'
import { Product } from '@/types'
import WishlistCard from '@/components/WishlistCard'

const styles = StyleSheet.create({
    extraText: {
        color: Color.White
    },
    scrollView: {
        marginTop: 5,
        flexDirection: "column"
    }
})

const wishlistScreen = () => {

    const { wishlist } = useWishlist();
    const itemUnit = wishlist.length > 1 ? "items" : "item";

    const renderItem = useCallback<ListRenderItem<Product>>(({ item }) => {
        return <WishlistCard item={item} />
    }, [])

    return (
        <ProfileHeader
            screenTitle={"Wishlist"}
            extraText={<AppText style={styles.extraText} typography={Typography.textBase}>{wishlist.length} {itemUnit}</AppText>}>
            <FlatList
                keyExtractor={(item) => item._id}
                data={wishlist}
                renderItem={renderItem}
            />
        </ProfileHeader>
    )
}

export default wishlistScreen