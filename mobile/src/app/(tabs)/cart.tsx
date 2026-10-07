import AppText from "@/src/components/AppText";
import CartItemCard from "@/src/components/CartItemCard";
import CartSummaryCard from "@/src/components/CartSummaryCard";
import SafeScreen from "@/src/components/SafeScreen";
import { useCartContext } from "@/src/context/CartContext";
import { useCart } from "@/src/hooks/useCart";
import { Color } from "@/src/models/Color";
import { Typography } from "@/src/models/Font";
import { CartItem, ShippingAddress } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import React, { Fragment, useCallback, useMemo, useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from "react-native";
import * as Sentry from '@sentry/react-native';
import useAddresses from "@/src/hooks/useAddresses";
import AddressSelectModal from "@/src/components/AddressSelectModal";
import { useStripe } from "@stripe/stripe-react-native"
import { useApi } from "@/src/lib/api";
import { sendLocalNotification } from '@/src/lib/notifications';
import { CartSkeleton } from "@/src/components/LoadingSkeletonView";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Color.Black
  },
  headerText: {
    color: Color.White
  },
  cartItemsContainer: {
    marginTop: 15,
    flexDirection: "column",
    maxHeight: "40%"
  },
  cartSummaryContainer: {
    marginTop: 20,
  },
  borderLine: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: Color.DarkGray,
    marginHorizontal: -25
  },
  checkoutContainer: {
    paddingTop: 15,
    flexDirection: "column"
  },
  checkoutItemsContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  itemCountContainer: {
    flexDirection: "row"
  },
  itemCountText: {
    paddingLeft: 5,
    color: Color.Grey
  },
  totalPrice: {
    color: Color.White
  },
  checkoutBtn: {
    marginTop: 20,
    height: 60,
    backgroundColor: Color.Green,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  checkoutBtnText: {
    color: Color.Black,
  }
})

const CartScreen = () => {
  const { cart, isLoading: isLoadingCart, isRefetching: isRefetchingCart, refetch: refetchCart } = useCartContext();
  const { cartItemCount, total, deleteCart } = useCart();
  const { addresses, isLoading: isLoadingAddresses } = useAddresses();
  const api = useApi();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const cartItems: CartItem[] = useMemo(() => {
    return cart?.items ?? [];
  }, [cart?.items]);

  const onPressCheckout = useCallback(() => {
    if (cartItems.length === 0) return;

    console.log("checkout");
    if (!addresses || addresses.length === 0) {
      Alert.alert(
        "No Address",
        "Please add a shipping address in your profile before checking out.",
        [{ text: "OK" }]
      );

      return;
    }

    setAddressModalVisible(true);
  }, [addresses, cartItems.length]);

  const handleCloseAddressModal = useCallback(() => {
    setAddressModalVisible(false);
  }, []);

  // Inside CartScreen after successful payment:
  const handlePaymentSuccess = useCallback(async () => {
    await sendLocalNotification(
      "Order Confirmed! 🎉",
      "Your payment was successful and your order is being processed.",
      // { orderId }
    );
  }, []);

  const onPressContinueToPayment = useCallback(async (shippingAddress: ShippingAddress) => {
    setAddressModalVisible(false);

    Sentry.addBreadcrumb({
      category: "checkout",
      message: "Checkout initiated",
      level: "info",
      data: {
        itemCount: cartItemCount,
        total: total.toFixed(2),
        city: shippingAddress.city,
      },
    });

    try {
      setPaymentLoading(true);

      const { data } = await api.post("/payment/create-intent", {
        cartItems,
        shippingAddress: shippingAddress
      });

      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: data.clientSecret,
        merchantDisplayName: "E-Commerce",
        returnURL: "mobile://stripe-redirect"
      });

      if (initError) {
        Sentry.captureException(initError, {
          extra: {
            errorCode: initError.code,
            errorMessage: initError.message,
            cartTotal: total,
            itemCount: cartItems.length,
          },
        });

        Alert.alert("Error", initError.message);
        setPaymentLoading(false);
        return;
      }

      const { error: presentError } = await presentPaymentSheet();
      if (presentError) {
        Sentry.addBreadcrumb({
          category: "payment",
          message: "Payment cancelled by user",
          level: "info",
          data: {
            errorCode: presentError.code,
            errorMessage: presentError.message,
            cartTotal: total,
            itemCount: cartItems.length,
          },
        });

        Alert.alert("Payment cancelled", presentError.message);
      } else {
        Sentry.addBreadcrumb({
          category: "payment",
          message: "Payment successful",
          level: "info",
          data: {
            total: total.toFixed(2),
            itemCount: cartItems.length,
          },
        });

        Alert.alert("Success", "Your payment was successful! Your order is being processed.", [
          { text: "OK", onPress: () => { } },
        ]);
        await deleteCart();
        await handlePaymentSuccess();
      }

    } catch (error) {
      Sentry.captureMessage("Payment failed", {
        level: "error",
        extra: {
          error: error instanceof Error ? error.message : "Unknown error",
          cartTotal: total,
          itemCount: cartItems.length,
        },
      });
      Alert.alert("Error", "Failed to process payment");
    } finally {
      setPaymentLoading(false);
    }
  }, [cartItemCount, total, api, cartItems, initPaymentSheet, presentPaymentSheet, deleteCart, handlePaymentSuccess]);

  const itemCountUnit = cartItemCount > 1 ? "items" : "item";

  if(isLoadingCart){
    return(<CartSkeleton/>);
  };

  if (!cart) return;
  return (
    <View style={styles.screen}>
      <SafeScreen>
        <AppText style={styles.headerText} typography={Typography.text3XlB}>{"Cart"}</AppText>
        <ScrollView
          style={styles.cartItemsContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetchingCart}
              onRefresh={refetchCart}
            />}
        >
          {cartItems.length > 0 ? cartItems.map((item) => {
            return <Fragment key={item._id}><CartItemCard item={item} /></Fragment>
          }) : null}
        </ScrollView>
        <View style={styles.cartSummaryContainer}>
          <CartSummaryCard />
        </View>
        <View style={styles.borderLine}></View>
        <View style={styles.checkoutContainer}>
          <View style={styles.checkoutItemsContainer}>
            <View style={styles.itemCountContainer}>
              <Ionicons name="cart" size={20} color={Color.Green} />
              <AppText style={styles.itemCountText} typography={Typography.textSm}>{cartItemCount} {itemCountUnit}</AppText>
            </View>
            <AppText style={styles.totalPrice} typography={Typography.textBaseB}>{"$"}{total.toFixed(2)}</AppText>
          </View>
          <TouchableOpacity
            style={styles.checkoutBtn}
            onPress={() => onPressCheckout()}
            disabled={isLoadingCart || paymentLoading}>
            {isLoadingCart || paymentLoading ? <ActivityIndicator size="small" color={Color.ProfileGray} />
              : <AppText style={styles.checkoutBtnText} typography={Typography.textBaseB}>{"Checkout →"}</AppText>}

          </TouchableOpacity>
        </View>
        {addresses && <AddressSelectModal
          id={cart._id}
          visible={addressModalVisible}
          addressList={addresses}
          isLoadingAddresses={isLoadingAddresses}
          onClose={handleCloseAddressModal}
          onPressContinue={(addr) => onPressContinueToPayment(addr)}
        />}
      </SafeScreen>
    </View>
  );
};

export default React.memo(CartScreen);