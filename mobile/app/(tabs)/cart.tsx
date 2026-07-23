import AppText from "@/components/AppText";
import CartItemCard from "@/components/CartItemCard";
import CartSummaryCard from "@/components/CartSummaryCard";
import SafeScreen from "@/components/SafeScreen";
import useCart from "@/hooks/useCart";
import { Color } from "@/models/Color";
import { Typography } from "@/models/Font";
import { Address, CartItem, ShippingAddress } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Fragment, useCallback, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Button, Alert, Modal, ActivityIndicator } from "react-native";
import * as Sentry from '@sentry/react-native';
import useAddresses from "@/hooks/useAddresses";
import AddressSelectModal from "@/components/AddressSelectModal";
import usePayment from "@/hooks/usePayment";
import { PaymentIntent, useStripe } from "@stripe/stripe-react-native"
import { useApi } from "@/lib/api";

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

  const { cart, isLoading: isLoadingCart, isError, cartItemCount, total, deleteCart } = useCart();
  const { addresses, isLoading: isLoadingAddresses } = useAddresses();
  const api = useApi();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const onPressCheckout = useCallback(() => {
    if (cartItems.length === 0) return;

    if (!addresses || addresses.length === 0) {
      Alert.alert(
        "No Address",
        "Please add a shipping address in your profile before checking out.",
        [{ text: "OK" }]
      );

      return;
    }

    setAddressModalVisible(true);
  }, [addresses]);

  const onPressContinueToPayment = useCallback(async (shippingAddress: ShippingAddress) => {
    setAddressModalVisible(false);

    Sentry.logger.info("Checkout initiated", {
      itemCount: cartItemCount,
      total: total.toFixed(2),
      city: shippingAddress.city,
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
        Sentry.logger.error("Payment sheet init failed", {
          errorCode: initError.code,
          errorMessage: initError.message,
          cartTotal: total,
          itemCount: cartItems.length,
        });

        Alert.alert("Error", initError.message);
        setPaymentLoading(false);
        return;
      }

      const { error: presentError } = await presentPaymentSheet();
      if (presentError) {
        Sentry.logger.error("Payment cancelled", {
          errorCode: presentError.code,
          errorMessage: presentError.message,
          cartTotal: total,
          itemCount: cartItems.length,
        });

        Alert.alert("Payment cancelled", presentError.message);
      } else {
        Sentry.logger.info("Payment successful", {
          total: total.toFixed(2),
          itemCount: cartItems.length,
        });

        Alert.alert("Success", "Your payment was successful! Your order is being processed.", [
          { text: "OK", onPress: () => { } },
        ]);
        deleteCart();
      }

    } catch (error) {
      Sentry.logger.error("Payment failed", {
        error: error instanceof Error ? error.message : "Unknown error",
        cartTotal: total,
        itemCount: cartItems.length,
      });
      Alert.alert("Error", "Failed to process payment");
    } finally {
      setPaymentLoading(false);
    }
  }, [])

  if (!cart) return;

  const cartItems: CartItem[] = cart?.items ?? [];
  const itemCountUnit = cartItemCount > 1 ? "items" : "item";
  return (
    <View style={styles.screen}>
      <SafeScreen>
        <AppText style={styles.headerText} typography={Typography.text3XlB}>{"Cart"}</AppText>
        <ScrollView style={styles.cartItemsContainer} showsVerticalScrollIndicator={false}>
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
          <TouchableOpacity style={styles.checkoutBtn} onPress={() => onPressCheckout()}>
            {isLoadingCart ? <ActivityIndicator size="small" color={Color.ProfileGray} />
              : <AppText style={styles.checkoutBtnText} typography={Typography.textBaseB}>{"Checkout →"}</AppText>}

          </TouchableOpacity>
        </View>
        {addresses && <AddressSelectModal
          id={cart._id}
          visible={addressModalVisible}
          addressList={addresses}
          isLoadingAddresses={isLoadingAddresses}
          onClose={() => {
            setAddressModalVisible(false);
          }}
          onPressContinue={(addr) => onPressContinueToPayment(addr)}
        />}
      </SafeScreen>
    </View>
  );
};

export default CartScreen;