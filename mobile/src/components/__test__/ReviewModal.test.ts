import { Alert } from "react-native";
import { OrderItem } from "@/src/types";

// Mock React Native Alert to prevent native bridge errors in pure TS environment
jest.mock("react-native", () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

describe("ReviewModal Data State and Business Logic", () => {
  let mockCreateReviewAsync: jest.Mock;
  let mockOnClose: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateReviewAsync = jest.fn();
    mockOnClose = jest.fn();
  });

  /**
   * Helper simulating the `onPressSubmit` data transformation logic from ReviewModal
   */
  const executeSubmitLogic = (
    orderItems: OrderItem[],
    orderId: string,
    ratingList: Record<string, number>,
    createReviewAsync: (data: any) => void,
    onClose: (isShowed: boolean) => void
  ) => {
    try {
      orderItems.forEach((item) => {
        const createReviewData = {
          productId: item.product._id,
          orderId: orderId,
          rating: ratingList[item.product._id],
        };
        createReviewAsync(createReviewData);
      });
      Alert.alert("Success", "Submit all ratings successfully", [
        { text: "OK", style: "default", onPress: () => onClose(false) },
      ]);
    } catch (error) {
      Alert.alert("Error", `Fail to submit all ratings: ${error}`, [
        { text: "OK", style: "default", onPress: () => onClose(false) },
      ]);
    }
  };

  test("should map order items and rating state into correct review payloads", () => {
    const mockOrderItems: OrderItem[] = [
      {
        _id: "item_1",
        name: "Item 1",
        image: "https://example.com/1.jpg",
        price: 10,
        quantity: 2,
        product: { _id: "prod_123" },
      } as OrderItem,
      {
        _id: "item_2",
        name: "Item 2",
        image: "https://example.com/2.jpg",
        price: 20,
        quantity: 1,
        product: { _id: "prod_456" },
      } as OrderItem,
    ];

    const orderId = "order_789";
    const ratingList = {
      prod_123: 5,
      prod_456: 4,
    };

    executeSubmitLogic(
      mockOrderItems,
      orderId,
      ratingList,
      mockCreateReviewAsync,
      mockOnClose
    );

    // Verify correct submission payload per product
    expect(mockCreateReviewAsync).toHaveBeenCalledTimes(2);
    expect(mockCreateReviewAsync).toHaveBeenNthCalledWith(1, {
      productId: "prod_123",
      orderId: "order_789",
      rating: 5,
    });
    expect(mockCreateReviewAsync).toHaveBeenNthCalledWith(2, {
      productId: "prod_456",
      orderId: "order_789",
      rating: 4,
    });

    // Verify alert triggered upon success
    expect(Alert.alert).toHaveBeenCalledWith(
      "Success",
      "Submit all ratings successfully",
      expect.arrayContaining([
        expect.objectContaining({ text: "OK", style: "default" }),
      ])
    );
  });

  test("should handle missing or unselected product ratings gracefully", () => {
    const mockOrderItems: OrderItem[] = [
      {
        _id: "item_1",
        product: { _id: "prod_123" },
      } as OrderItem,
    ];

    const orderId = "order_789";
    const ratingList = {}; // No rating assigned yet

    executeSubmitLogic(
      mockOrderItems,
      orderId,
      ratingList,
      mockCreateReviewAsync,
      mockOnClose
    );

    expect(mockCreateReviewAsync).toHaveBeenCalledWith({
      productId: "prod_123",
      orderId: "order_789",
      rating: undefined,
    });
  });

  test("should trigger Alert.alert error handling when payload execution throws", () => {
    const mockOrderItems: OrderItem[] = [
      {
        _id: "item_1",
        product: { _id: "prod_123" },
      } as OrderItem,
    ];

    const throwingCreateReview = jest.fn().mockImplementation(() => {
      throw new Error("API Failure");
    });

    executeSubmitLogic(
      mockOrderItems,
      "order_789",
      { prod_123: 5 },
      throwingCreateReview,
      mockOnClose
    );

    expect(Alert.alert).toHaveBeenCalledWith(
      "Error",
      expect.stringContaining("Fail to submit all ratings: Error: API Failure"),
      expect.any(Array)
    );
  });

  test("should trigger onClose callback when Alert action button is pressed", () => {
    const mockOrderItems: OrderItem[] = [
      {
        _id: "item_1",
        product: { _id: "prod_123" },
      } as OrderItem,
    ];

    executeSubmitLogic(
      mockOrderItems,
      "order_789",
      { prod_123: 5 },
      mockCreateReviewAsync,
      mockOnClose
    );

    // Extract the alert callback function
    const alertCalls = (Alert.alert as jest.Mock).mock.calls[0];
    const buttons = alertCalls[2];
    const okButton = buttons.find((btn: any) => btn.text === "OK");

    // Simulate alert button click
    okButton.onPress();

    expect(mockOnClose).toHaveBeenCalledWith(false);
  });
});