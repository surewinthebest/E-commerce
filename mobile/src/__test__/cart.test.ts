import { Alert } from "react-native";
import * as Sentry from "@sentry/react-native";

// --- Mocks ---
const mockPost = jest.fn();
const mockInitPaymentSheet = jest.fn();
const mockPresentPaymentSheet = jest.fn();
const mockDeleteCart = jest.fn();

jest.mock("@/src/lib/api", () => ({
  useApi: () => ({
    post: mockPost,
  }),
}));

jest.mock("@stripe/stripe-react-native", () => ({
  useStripe: () => ({
    initPaymentSheet: mockInitPaymentSheet,
    presentPaymentSheet: mockPresentPaymentSheet,
  }),
}));

// ✅ Updated Sentry mock to match real Sentry APIs
jest.mock("@sentry/react-native", () => ({
  addBreadcrumb: jest.fn(),
  captureMessage: jest.fn(),
  captureException: jest.fn(),
}));

jest.spyOn(Alert, "alert");

describe("Cart Data State & Logic Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Cart state and item unit singular/plural logic", () => {
    it("should map item count correctly for plural vs singular", () => {
      const getItemCountUnit = (count: number) => (count > 1 ? "items" : "item");

      expect(getItemCountUnit(0)).toBe("item");
      expect(getItemCountUnit(1)).toBe("item");
      expect(getItemCountUnit(2)).toBe("items");
      expect(getItemCountUnit(5)).toBe("items");
    });

    it("should safely extract cart items or fallback to empty array when cart or items is undefined", () => {
      const getCartItems = (cart: { items?: any[] } | null | undefined) => cart?.items ?? [];

      expect(getCartItems(null)).toEqual([]);
      expect(getCartItems(undefined)).toEqual([]);
      expect(getCartItems({})).toEqual([]);
      expect(getCartItems({ items: [{ _id: "1" }] })).toEqual([{ _id: "1" }]);
    });
  });

  describe("Checkout Validation Logic", () => {
    it("should block checkout when cart has no items", () => {
      const cartItems: any[] = [];
      const addresses: any[] = [{ id: "1" }];
      let modalVisible = false;

      const handleCheckout = () => {
        if (cartItems.length === 0) return;
        if (!addresses || addresses.length === 0) {
          Alert.alert("No Address", "Please add a shipping address in your profile before checking out.");
          return;
        }
        modalVisible = true;
      };

      handleCheckout();

      expect(modalVisible).toBe(false);
      expect(Alert.alert).not.toHaveBeenCalled();
    });

    it("should show alert if user has no shipping addresses", () => {
      const cartItems = [{ _id: "1", name: "Item 1" }];
      const addresses: any[] = [];
      let modalVisible = false;

      const handleCheckout = () => {
        if (cartItems.length === 0) return;
        if (!addresses || addresses.length === 0) {
          Alert.alert("No Address", "Please add a shipping address in your profile before checking out.");
          return;
        }
        modalVisible = true;
      };

      handleCheckout();

      expect(modalVisible).toBe(false);
      expect(Alert.alert).toHaveBeenCalledWith(
        "No Address",
        "Please add a shipping address in your profile before checking out.",
        [{ text: "OK" }]
      );
    });

    it("should open address modal if cart has items and address exists", () => {
      const cartItems = [{ _id: "1" }];
      const addresses = [{ id: "addr_1" }];
      let modalVisible = false;

      const handleCheckout = () => {
        if (cartItems.length === 0) return;
        if (!addresses || addresses.length === 0) return;
        modalVisible = true;
      };

      handleCheckout();

      expect(modalVisible).toBe(true);
    });
  });

  describe("Payment Processing Pipeline", () => {
    const mockShippingAddress = {
      street: "123 Main St",
      city: "Metropolis",
      country: "US",
    };
    const cartItems = [{ _id: "item_1", price: 50 }];
    const cartItemCount = 1;
    const total = 50.0;

    it("should handle successful payment flow and delete cart state", async () => {
      mockPost.mockResolvedValueOnce({ data: { clientSecret: "sec_123" } });
      mockInitPaymentSheet.mockResolvedValueOnce({ error: null });
      mockPresentPaymentSheet.mockResolvedValueOnce({ error: null });

      const continueToPayment = async (shippingAddress: typeof mockShippingAddress) => {
        // ✅ Replaced Sentry.logger.info with Sentry.addBreadcrumb
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
          const { data } = await mockPost("/payment/create-intent", {
            cartItems,
            shippingAddress,
          });

          const { error: initError } = await mockInitPaymentSheet({
            paymentIntentClientSecret: data.clientSecret,
            merchantDisplayName: "E-Commerce",
            returnURL: "mobile://stripe-redirect",
          });

          if (initError) {
            Alert.alert("Error", initError.message);
            return;
          }

          const { error: presentError } = await mockPresentPaymentSheet();
          if (presentError) {
            Alert.alert("Payment cancelled", presentError.message);
          } else {
            Alert.alert("Success", "Your payment was successful! Your order is being processed.");
            await mockDeleteCart();
          }
        } catch (error: any) {
          Alert.alert("Error", "Failed to process payment: " + (error.message || "Unknown error"));
        }
      };

      await continueToPayment(mockShippingAddress);

      expect(mockPost).toHaveBeenCalledWith("/payment/create-intent", {
        cartItems,
        shippingAddress: mockShippingAddress,
      });
      expect(mockInitPaymentSheet).toHaveBeenCalledWith({
        paymentIntentClientSecret: "sec_123",
        merchantDisplayName: "E-Commerce",
        returnURL: "mobile://stripe-redirect",
      });
      expect(mockPresentPaymentSheet).toHaveBeenCalled();
      expect(Alert.alert).toHaveBeenCalledWith(
        "Success",
        "Your payment was successful! Your order is being processed."
      );
      expect(mockDeleteCart).toHaveBeenCalledTimes(1);
      expect(Sentry.addBreadcrumb).toHaveBeenCalledWith({
        category: "checkout",
        message: "Checkout initiated",
        level: "info",
        data: {
          itemCount: 1,
          total: "50.00",
          city: "Metropolis",
        },
      });
    });

    it("should handle payment sheet initialization failure", async () => {
      mockPost.mockResolvedValueOnce({ data: { clientSecret: "sec_123" } });
      mockInitPaymentSheet.mockResolvedValueOnce({
        error: { code: "Failed", message: "Failed to initialize stripe" },
      });

      const continueToPayment = async () => {
        try {
          const { data } = await mockPost("/payment/create-intent", { cartItems });
          const { error: initError } = await mockInitPaymentSheet({
            paymentIntentClientSecret: data.clientSecret,
          });

          if (initError) {
            // ✅ Replaced Sentry.logger.error with Sentry.captureMessage
            Sentry.captureMessage("Payment sheet init failed", {
              level: "error",
              extra: {
                errorCode: initError.code,
                errorMessage: initError.message,
              },
            });
            Alert.alert("Error", initError.message);
            return;
          }

          await mockPresentPaymentSheet();
        } catch (error: any) {
          Alert.alert("Error", "Failed to process payment: " + (error.message || "Unknown error"));
        }
      };

      await continueToPayment();

      expect(mockPresentPaymentSheet).not.toHaveBeenCalled();
      expect(mockDeleteCart).not.toHaveBeenCalled();
      expect(Sentry.captureMessage).toHaveBeenCalledWith("Payment sheet init failed", {
        level: "error",
        extra: {
          errorCode: "Failed",
          errorMessage: "Failed to initialize stripe",
        },
      });
      expect(Alert.alert).toHaveBeenCalledWith("Error", "Failed to initialize stripe");
    });

    it("should handle payment cancellation gracefully", async () => {
      mockPost.mockResolvedValueOnce({ data: { clientSecret: "sec_123" } });
      mockInitPaymentSheet.mockResolvedValueOnce({ error: null });
      mockPresentPaymentSheet.mockResolvedValueOnce({
        error: { code: "Canceled", message: "User canceled payment" },
      });

      const continueToPayment = async () => {
        try {
          const { data } = await mockPost("/payment/create-intent", { cartItems });
          await mockInitPaymentSheet({ paymentIntentClientSecret: data.clientSecret });

          const { error: presentError } = await mockPresentPaymentSheet();
          if (presentError) {
            // ✅ Replaced Sentry.logger.error with Sentry.captureMessage
            Sentry.captureMessage("Payment cancelled", {
              level: "warning",
              extra: {
                errorCode: presentError.code,
                errorMessage: presentError.message,
              },
            });
            Alert.alert("Payment cancelled", presentError.message);
          } else {
            await mockDeleteCart();
          }
        } catch (error: any) {
          Alert.alert("Error", "Failed to process payment: " + (error.message || "Unknown error"));
        }
      };

      await continueToPayment();

      expect(Alert.alert).toHaveBeenCalledWith("Payment cancelled", "User canceled payment");
      expect(mockDeleteCart).not.toHaveBeenCalled();
      expect(Sentry.captureMessage).toHaveBeenCalledWith("Payment cancelled", {
        level: "warning",
        extra: {
          errorCode: "Canceled",
          errorMessage: "User canceled payment",
        },
      });
    });

    it("should catch API network errors during payment intent creation", async () => {
      mockPost.mockRejectedValueOnce(new Error("Network Error"));

      const continueToPayment = async () => {
        try {
          await mockPost("/payment/create-intent", { cartItems });
        } catch (error: any) {
          // ✅ Replaced Sentry.logger.error with Sentry.captureMessage
          Sentry.captureMessage("Payment failed", {
            level: "error",
            extra: {
              error: error instanceof Error ? error.message : "Unknown error",
            },
          });
          Alert.alert("Error", "Failed to process payment: " + (error.message || "Unknown error"));
        }
      };

      await continueToPayment();

      expect(Sentry.captureMessage).toHaveBeenCalledWith("Payment failed", {
        level: "error",
        extra: {
          error: "Network Error",
        },
      });
      expect(Alert.alert).toHaveBeenCalledWith("Error", "Failed to process payment: Network Error");
      expect(mockInitPaymentSheet).not.toHaveBeenCalled();
    });
  });
});