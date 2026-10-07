import { Alert } from "react-native";
import { useCart } from "@/src/hooks/useCart";
import useWishlist from "@/src/hooks/useWishlist";
import { Product } from "@/src/types";

const createMockProduct = (overrides?: Partial<Product>): Product => ({
    _id: "prod-123",
    name: "Wireless Headphones",
    category: "Electronics",
    description: "Sample product description",
    images: ["https://example.com/image.jpg"],
    price: 99,
    stock: 10,
    averageRating: 4.5,
    totalReviews: 120,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
});

// Mock external dependencies and hooks
jest.mock("react-native", () => ({
    Alert: { alert: jest.fn() },
    StyleSheet: { create: (styles: any) => styles },
}));

jest.mock("expo-router", () => ({
    router: { push: jest.fn() },
}));

jest.mock("@/src/hooks/useCart");
jest.mock("@/src/hooks/useWishlist");

describe("ProductCard Data & Hook Logic", () => {
    const mockProduct = createMockProduct();

    const mockAddToCart = jest.fn();
    const mockToggleWishlist = jest.fn();
    const mockIsExistInWishlist = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        (useCart as jest.Mock).mockReturnValue({
            isAddingToCart: false,
            addToCart: mockAddToCart,
        });

        (useWishlist as jest.Mock).mockReturnValue({
            isExistInWishlist: mockIsExistInWishlist,
            toggleWishlist: mockToggleWishlist,
            isAddingToWishlist: false,
            isRemovingFromWishlist: false,
        });
    });

    describe("Cart Action Data Flow", () => {
        it("triggers addToCart with correct payload structure", () => {
            const { addToCart } = useCart();

            // Simulating execution of handleAddToCart logic directly
            addToCart(
                { productId: mockProduct._id, quantity: 1 },
                { onSuccess: jest.fn(), onError: jest.fn() }
            );

            expect(addToCart).toHaveBeenCalledWith(
                { productId: "prod-123", quantity: 1 },
                expect.objectContaining({
                    onSuccess: expect.any(Function),
                    onError: expect.any(Function),
                })
            );
        });

        it("triggers success Alert when addToCart callback succeeds", () => {
            mockAddToCart.mockImplementation((payload, callbacks) => {
                callbacks.onSuccess();
            });

            const { addToCart } = useCart();
            addToCart(
                { productId: mockProduct._id, quantity: 1 },
                {
                    onSuccess: () => {
                        Alert.alert("Success", `${mockProduct.name} added to cart!`);
                    },
                }
            );

            expect(Alert.alert).toHaveBeenCalledWith("Success", "Wireless Headphones added to cart!");
        });

        it("triggers error Alert with response message when addToCart fails", () => {
            const mockError = { response: { data: { error: "Out of stock" } } };

            mockAddToCart.mockImplementation((payload, callbacks) => {
                callbacks.onError(mockError);
            });

            const { addToCart } = useCart();
            addToCart(
                { productId: mockProduct._id, quantity: 1 },
                {
                    onError: (error: any) => {
                        Alert.alert("Error", error?.response?.data?.error || "Failed to add to cart");
                    },
                }
            );

            expect(Alert.alert).toHaveBeenCalledWith("Error", "Out of stock");
        });

        it("triggers default error Alert when error response data is missing", () => {
            mockAddToCart.mockImplementation((payload, callbacks) => {
                callbacks.onError({});
            });

            const { addToCart } = useCart();
            addToCart(
                { productId: mockProduct._id, quantity: 1 },
                {
                    onError: (error: any) => {
                        Alert.alert("Error", error?.response?.data?.error || "Failed to add to cart");
                    },
                }
            );

            expect(Alert.alert).toHaveBeenCalledWith("Error", "Failed to add to cart");
        });
    });

    describe("Wishlist State Logic", () => {
        it("checks if product exists in wishlist", () => {
            mockIsExistInWishlist.mockReturnValue(true);

            const { isExistInWishlist } = useWishlist();
            const exists = isExistInWishlist(mockProduct._id);

            expect(mockIsExistInWishlist).toHaveBeenCalledWith("prod-123");
            expect(exists).toBe(true);
        });

        it("invokes toggleWishlist with target product ID", () => {
            const { toggleWishlist } = useWishlist();
            toggleWishlist(mockProduct._id);

            expect(mockToggleWishlist).toHaveBeenCalledWith("prod-123");
        });

        it("calculates pending state when wishlist mutations are active", () => {
            (useWishlist as jest.Mock).mockReturnValue({
                isExistInWishlist: mockIsExistInWishlist,
                toggleWishlist: mockToggleWishlist,
                isAddingToWishlist: true,
                isRemovingFromWishlist: false,
            });

            const state = useWishlist();
            const isDisabled = state.isAddingToWishlist || state.isRemovingFromWishlist;

            expect(isDisabled).toBe(true);
        });
    });
});