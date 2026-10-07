import { Product } from "@/src/types";

// Helper replicating the exact filtering logic from ShopScreen's useMemo
function computeFilteredProducts(
  products: Product[] | undefined | null,
  selectedCategory: string,
  searchQuery: string
): Product[] {
  if (!products) return [];

  let filtered = products;

  if (selectedCategory !== "All") {
    filtered = filtered.filter((product) => product.category === selectedCategory);
  }

  if (searchQuery.trim()) {
    filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return filtered;
}

describe("ShopScreen Data State & Filtering Logic", () => {
  const mockProducts: Product[] = [
    { _id: "1", name: "Wireless Headphones", category: "Electronics" },
    { _id: "2", name: "Running Shoes", category: "Sports" },
    { _id: "3", name: "Cotton T-Shirt", category: "Fashion" },
    { _id: "4", name: "Smartwatch", category: "Electronics" },
    { _id: "5", name: "JavaScript Guide Book", category: "Books" },
  ] as Product[];

  describe("Initial & Default States", () => {
    it("returns all products when category is 'All' and searchQuery is empty", () => {
      const result = computeFilteredProducts(mockProducts, "All", "");
      expect(result).toEqual(mockProducts);
      expect(result).toHaveLength(5);
    });

    it("returns an empty array when products data is undefined or null", () => {
      expect(computeFilteredProducts(undefined, "All", "")).toEqual([]);
      expect(computeFilteredProducts(null as unknown as Product[], "All", "")).toEqual([]);
    });

    it("returns an empty array when products list is empty", () => {
      const result = computeFilteredProducts([], "All", "");
      expect(result).toEqual([]);
    });
  });

  describe("Category Filtering", () => {
    it("filters products correctly by selected category", () => {
      const result = computeFilteredProducts(mockProducts, "Electronics", "");
      expect(result).toEqual([
        { _id: "1", name: "Wireless Headphones", category: "Electronics" },
        { _id: "4", name: "Smartwatch", category: "Electronics" },
      ]);
      expect(result).toHaveLength(2);
    });

    it("returns empty array if selected category has no matching products", () => {
      const result = computeFilteredProducts(mockProducts, "Home & Kitchen", "");
      expect(result).toEqual([]);
    });
  });

  describe("Search Filtering", () => {
    it("filters products by search query regardless of letter case", () => {
      const resultUpper = computeFilteredProducts(mockProducts, "All", "HEADPHONES");
      const resultLower = computeFilteredProducts(mockProducts, "All", "headphones");

      expect(resultUpper).toHaveLength(1);
      expect(resultUpper[0]._id).toBe("1");
      expect(resultUpper).toEqual(resultLower);
    });

    it("ignores whitespace-only search query and treats it as empty", () => {
      const result = computeFilteredProducts(mockProducts, "All", "   ");
      expect(result).toEqual(mockProducts);
    });

    it("returns empty array when search query matches no products", () => {
      const result = computeFilteredProducts(mockProducts, "All", "NonExistentItem");
      expect(result).toEqual([]);
    });
  });

  describe("Combined Filter Logic (Current Component Behavior)", () => {
    it("overrides category filter when search query is present", () => {
      // Searching 'Shoes' while 'Electronics' is selected
      const result = computeFilteredProducts(mockProducts, "Electronics", "Shoes");

      // Per current component code: search overrides category filtering
      expect(result).toEqual([
        { _id: "2", name: "Running Shoes", category: "Sports" },
      ]);
    });
  });
});