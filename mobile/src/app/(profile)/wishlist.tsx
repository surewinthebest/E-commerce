import { FlatList, ListRenderItem, StyleSheet } from 'react-native'
import React, { useCallback } from 'react'
import ProfileHeader from '@/src/components/ProfileHeader'
import { Typography } from '@/src/models/Font'
import { Color } from '@/src/models/Color'
import AppText from '@/src/components/AppText'
import useWishlist from '@/src/hooks/useWishlist'
import { Product } from '@/src/types'
import WishlistCard from '@/src/components/WishlistCard'
import { WishlistSkeleton } from '@/src/components/LoadingSkeletonView'

const styles = StyleSheet.create({
    extraText: {
        color: Color.White
    },
    scrollView: {
        marginTop: 5,
        flexDirection: "column"
    }
})

const WishlistScreen = () => {

    const { wishlist, isLoading: isLoadingWishlist } = useWishlist();
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
                ListEmptyComponent={isLoadingWishlist ? <WishlistSkeleton /> : null}
            />
        </ProfileHeader>
    )
}

export default React.memo(WishlistScreen);