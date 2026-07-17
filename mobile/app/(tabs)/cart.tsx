import AppText from "@/components/AppText";
import CartItemCard from "@/components/CartItemCard";
import CartSummaryCard from "@/components/CartSummaryCard";
import SafeScreen from "@/components/SafeScreen";
import useCart from "@/hooks/useCart";
import { Color } from "@/models/Color";
import { Typography } from "@/models/Font";
import { CartItem } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Fragment, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Button } from "react-native";
import * as Sentry from '@sentry/react-native';

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

  const { cart, isLoading, isError, cartItemCount, total } = useCart();


  const cartItems: CartItem[] = cart?.items ?? [];
  const itemCountUnit = cartItemCount > 1 ? "items" : "item";
  return (
    <View style={styles.screen}>
      <SafeScreen>
      <Button title='Try!' onPress={ () => { Sentry.captureException(new Error('First error')) }}/>
        <AppText style={styles.headerText} typography={Typography.text3XlB}>Cart</AppText>
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
            <AppText style={styles.totalPrice} typography={Typography.textBaseB}>${total.toFixed(2)}</AppText>
          </View>
          <TouchableOpacity style={styles.checkoutBtn}>
            <AppText style={styles.checkoutBtnText} typography={Typography.textBaseB}>{"Checkout →"}</AppText>
          </TouchableOpacity>
        </View>
      </SafeScreen>

    </View>
  );
};

export default CartScreen;