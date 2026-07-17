import AppText from "@/components/AppText";
import ProductCard from "@/components/ProductCard";
import SafeScreen from "@/components/SafeScreen";
import useProducts from "@/hooks/useProducts";
import { Color } from "@/models/Color";
import { Typography } from "@/models/Font";
import { Product } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useMemo, useState } from "react";
import { View, StyleSheet, TextInput, ScrollView, Image, FlatList, ListRenderItem, TouchableOpacity, ActivityIndicator } from "react-native";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Color.Black,
  },
  titleContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },
  headerText: {
    color: Color.White
  },
  headerDescText: {
    marginTop: 5,
    color: Color.Grey
  },
  searchBarContainer: {
    marginTop: 25,
    flexDirection: "row",
    backgroundColor: Color.DarkGray,
    borderRadius: 10,
    alignItems: "center",
    paddingHorizontal: 10
  },
  searchBar: {
    borderRadius: 10,
    backgroundColor: Color.DarkGray,
    height: 40,
    left: 20,
    color: Color.Grey,
  },
  categoryScrollViewContainer: {
    height: 90
  },
  categoryScrollView: {
    marginTop: 15,
    right: 5,
    marginRight: -25,
  },
  categoryItemContainer: {
    width: 70,
    height: 70,
    backgroundColor: Color.DarkGray,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginHorizontal: 5
  },
  categoryItemImage: {
    width: 45,
    height: 45,
  },
  subtitleContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  subtitle: {
    color: Color.White,
  },
  subtitleDesc: {
    color: Color.Grey,
  },
  flatlist: {
    marginTop: 15,
    marginLeft: -10,
  },
  flatlistRow: {
    marginBottom: 10,
    justifyContent: "space-between"
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop:"30%"
  },
  loadingText: {
    color: Color.Grey,
    paddingTop: 5
  }
})

const CATEGORIES = [
  { name: "All", icon: "grid-outline" as const },
  { name: "Electronics", image: require("../../assets/images/electronics.png") },
  { name: "Fashion", image: require("../../assets/images/fashion.png") },
  { name: "Sports", image: require("../../assets/images/sports.png") },
  { name: "Books", image: require("../../assets/images/books.png") },
]

const ShopScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");


  const { data: products, isLoading, isError } = useProducts();

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let filtered = products;

    if (selectedCategory !== "All") {
      filtered = filtered.filter((product: Product) => product.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      filtered = products.filter((product: Product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    return filtered;
  }, [products, searchQuery, selectedCategory])

  const renderItem = useCallback<ListRenderItem<Product>>(({ item }) => {
    return <ProductCard product={item} />
  }, [])

  return (
    <View style={styles.screen}>
      <SafeScreen>
        <View style={styles.titleContainer}>
          <AppText style={styles.headerText} typography={Typography.text3XlB}>Shop</AppText>
          <AppText style={styles.headerDescText} typography={Typography.textSm}>Browse all products</AppText>
        </View>

        <View style={styles.searchBarContainer}>
          <Ionicons color={Color.Grey} size={22} name="search" />

          <TextInput
            style={styles.searchBar}
            placeholderTextColor={Color.Grey}
            placeholder="Search for products"
            value={searchQuery}
            onChangeText={(t) => setSearchQuery(t)} />
        </View>

        <View style={styles.categoryScrollViewContainer}>
          <ScrollView horizontal={true} style={styles.categoryScrollView} showsHorizontalScrollIndicator={false}>
            {CATEGORIES.map((category) => {
              return <TouchableOpacity
                key={category.name}
                style={styles.categoryItemContainer}
                onPress={() => setSelectedCategory(category.name)}>
                {category?.icon ? (
                  <Ionicons name={category.icon} size={30} color={Color.Grey} />
                ) : (
                  <Image source={category.image} style={styles.categoryItemImage} />
                )}</TouchableOpacity>
            })}
          </ScrollView>
        </View>

        <View style={styles.subtitleContainer}>
          <AppText style={styles.subtitle} typography={Typography.textBaseB}>Products</AppText>
          <AppText style={styles.subtitleDesc} typography={Typography.textSm}>{filteredProducts.length} items</AppText>
        </View>

        <FlatList
          keyExtractor={(item) => item._id}
          style={styles.flatlist}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          data={filteredProducts}
          numColumns={2}
          columnWrapperStyle={styles.flatlistRow}
          ListEmptyComponent={
            isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
                <AppText style={styles.loadingText} typography={Typography.textLgB}>Loading products...</AppText>
              </View>
            ) : isError ? (
              <View style={styles.loadingContainer}>
                <Ionicons name="alert-circle-outline" size={48} color={Color.Red} />
                <AppText style={styles.loadingText} typography={Typography.textSm}>Failed to load products</AppText>
                <AppText style={styles.loadingText} typography={Typography.textSm}>Please try again later</AppText>
              </View>
            ) : (<View style={styles.loadingContainer}>
              <Ionicons name="search-outline" size={48} color={Color.Grey} />
              <AppText style={styles.loadingText} typography={Typography.textSm}>No products found</AppText>
              <AppText style={styles.loadingText} typography={Typography.textSm}>Try adjusting your filters</AppText>
            </View>)
          }
        />

      </SafeScreen>
    </View>

  );
};

export default ShopScreen;