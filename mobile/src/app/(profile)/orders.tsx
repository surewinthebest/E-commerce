import { StyleSheet, ScrollView } from 'react-native'
import React, { useCallback, useState } from 'react'
import ProfileHeader from '@/src/components/ProfileHeader';
import useOrders from '@/src/hooks/useOrders';
import OrderCard from '@/src/components/OrderCard';
import EmptyUI from '@/src/components/EmptyUI';
import ReviewModal from '@/src/components/ReviewModal';
import { OrderItem } from '@/src/types';
import { OrdersSkeleton } from '@/src/components/LoadingSkeletonView';

const styles = StyleSheet.create({
    scrollView: {
        flex: 1
    }
})

const OrdersScreen = () => {
    const { data: orders, isLoading: isLoadingOrders } = useOrders();
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewInfo, setReviewInfo] = useState<{ orderId: string, orderItems: OrderItem[] | null }>({ orderId: "", orderItems: null });
    const [ratinglist, setRatingList] = useState<{ [key: string]: number }>({});
    console.log("orders", JSON.stringify(orders));

    const onPressReviewModal = useCallback((orderId: string, orderItems: OrderItem[] | null) => {
        const initialRatingList: { [key: string]: number } = {};
        orderItems?.forEach((item) => {
            initialRatingList[item.product._id] = 0;
        });
        setRatingList(initialRatingList);
        setReviewInfo({ orderId: orderId, orderItems: orderItems });
        setShowReviewModal(true);
    }, []);

    if (orders?.length === 0) {
        return <EmptyUI
            hasBackBtn={true}
            emptyHeader={"My Orders"}
            emptyIcon={"receipt-outline"}
            emptyTitle={"No orders yet"}
            emptyMsg={"Your order history will appear here"}
        />
    };


    return (
        <ProfileHeader screenTitle={"My Orders"}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {orders?.map((order) => {
                    return <React.Fragment key={order._id}><OrderCard
                        orderId={order._id}
                        orderItems={order.orderItems}
                        createdAt={order.createdAt}
                        status={order.status}
                        totalPrice={order.totalPrice.toFixed(2)}
                        hasReviewed={order.hasReviewed}
                        setShowReviewModal={setShowReviewModal}
                        setReviewInfo={(orderId: string, orderItems: OrderItem[] | null) => onPressReviewModal(orderId, orderItems)}
                    /></React.Fragment>
                })}
                {isLoadingOrders && <OrdersSkeleton />}
            </ScrollView>

            <ReviewModal
                visible={showReviewModal}
                orderItems={reviewInfo.orderItems ?? []}
                orderId={reviewInfo.orderId}
                onClose={setShowReviewModal}
                ratingList={ratinglist}
                onRatingChange={(productId, star) =>
                    setRatingList((prev) => ({ ...prev, [productId]: star }))} />
        </ProfileHeader>
    )
}

export default React.memo(OrdersScreen);