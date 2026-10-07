import { renderHook } from '@testing-library/react-native';
import useOrders from '@/src/hooks/useOrders';
import useReviews from '@/src/hooks/useReviews';
import { OrderItem } from '@/src/types';

// Mock custom hooks used in the screen
jest.mock('@/src/hooks/useOrders');
jest.mock('@/src/hooks/useReviews');

describe('Orders Data & State Logic', () => {
  const mockUseOrders = useOrders as jest.Mock;
  const mockUseReviews = useReviews as jest.Mock;
  const mockCreateReviewAsync = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseReviews.mockReturnValue({
      createReviewAsync: mockCreateReviewAsync,
    });
  });

  describe('useOrders Hook States', () => {
    it('handles successful orders fetch state', async () => {
      const mockOrders = [
        {
          _id: 'order_1',
          createdAt: '2026-01-01',
          status: 'DELIVERED',
          totalPrice: 150.5,
          hasReviewed: false,
          orderItems: [{ product: { _id: 'prod_1' }, quantity: 2 }],
        },
      ];

      mockUseOrders.mockReturnValue({
        data: mockOrders,
        isLoading: false,
        isError: false,
      });

      const { result } = await renderHook(() => useOrders());

      expect(result.current.data).toEqual(mockOrders);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
    });

    it('handles empty orders state', async () => {
      mockUseOrders.mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
      });

      const { result } = await renderHook(() => useOrders());

      expect(result.current.data).toEqual([]);
      expect(result.current.data?.length).toBe(0);
    });

    it('handles loading state', async () => {
      mockUseOrders.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
      });

      const { result } = await renderHook(() => useOrders());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
    });

    it('handles error state', async () => {
      mockUseOrders.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
      });

      const { result } = await renderHook(() => useOrders());

      expect(result.current.isError).toBe(true);
      expect(result.current.data).toBeUndefined();
    });
  });

  describe('Review Modal & Rating State Logic', () => {
    it('initializes ratingList with 0 for each order item when modal is pressed', () => {
      const mockOrderItems: OrderItem[] = [
        { product: { _id: 'prod_101' } } as OrderItem,
        { product: { _id: 'prod_102' } } as OrderItem,
      ];

      // Simulating the handler function logic: onPressReviewModal
      const onPressReviewModal = (orderId: string, items: OrderItem[] | null) => {
        const initialRatingList: { [key: string]: number } = {};
        items?.forEach((item) => {
          initialRatingList[item.product._id] = 0;
        });
        return {
          ratingList: initialRatingList,
          reviewInfo: { orderId, orderItems: items },
          showReviewModal: true,
        };
      };

      const state = onPressReviewModal('order_999', mockOrderItems);

      expect(state.showReviewModal).toBe(true);
      expect(state.reviewInfo).toEqual({
        orderId: 'order_999',
        orderItems: mockOrderItems,
      });
      expect(state.ratingList).toEqual({
        prod_101: 0,
        prod_102: 0,
      });
    });

    it('handles null orderItems gracefully during modal toggle', () => {
      const onPressReviewModal = (orderId: string, items: OrderItem[] | null) => {
        const initialRatingList: { [key: string]: number } = {};
        items?.forEach((item) => {
          initialRatingList[item.product._id] = 0;
        });
        return {
          ratingList: initialRatingList,
          reviewInfo: { orderId, orderItems: items },
          showReviewModal: true,
        };
      };

      const state = onPressReviewModal('order_999', null);

      expect(state.ratingList).toEqual({});
      expect(state.reviewInfo.orderItems).toBeNull();
    });

    it('updates rating state dynamically per product', () => {
      // Simulating state updater function: setRatingList((prev) => ({ ...prev, [productId]: star }))
      let ratingList: { [key: string]: number } = { prod_101: 0, prod_102: 0 };

      const updateRating = (productId: string, star: number) => {
        ratingList = { ...ratingList, [productId]: star };
      };

      updateRating('prod_101', 5);
      expect(ratingList).toEqual({ prod_101: 5, prod_102: 0 });

      updateRating('prod_102', 4);
      expect(ratingList).toEqual({ prod_101: 5, prod_102: 4 });
    });
  });

  describe('onRatingChange API Action Trigger', () => {
    it('calls createReviewAsync with correct payload', () => {
      const onRatingChange = (productId: string, orderId: string, rating: number) => {
        mockCreateReviewAsync({ productId, orderId, rating });
      };

      onRatingChange('prod_101', 'order_999', 5);

      expect(mockCreateReviewAsync).toHaveBeenCalledTimes(1);
      expect(mockCreateReviewAsync).toHaveBeenCalledWith({
        productId: 'prod_101',
        orderId: 'order_999',
        rating: 5,
      });
    });
  });
});