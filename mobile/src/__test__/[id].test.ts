import { renderHook, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { useCallback, useState } from 'react';
import useProduct from '@/src/hooks/useProduct';
import useWishlist from '@/src/hooks/useWishlist';
import { useCart } from '@/src/hooks/useCart';
import { useLocalSearchParams } from 'expo-router';

// Mock dependencies
jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
  router: { back: jest.fn() },
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('@/src/hooks/useProduct');
jest.mock('@/src/hooks/useWishlist');
jest.mock('@/src/hooks/useCart');

// Mock Alert.alert
jest.spyOn(Alert, 'alert').mockImplementation(() => { });

const mockUseProduct = useProduct as jest.Mock;
const mockUseWishlist = useWishlist as jest.Mock;
const mockUseCart = useCart as jest.Mock;
const mockUseLocalSearchParams = useLocalSearchParams as jest.Mock;

/**
 * Custom hook to encapsulate and isolate component data state & logical callbacks
 * without executing or asserting UI JSX rendering.
 */
function useProductDetailDataState() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { data: item, isError, isLoading } = useProduct(id);
  const {
    isExistInWishlist,
    addToWishlist,
    isAddingToWishlist,
    removeFromWishlist,
    isRemovingFromWishlist,
  } = useWishlist();
  const { addToCart, isAddingToCart } = useCart();

  const wishlisted = isExistInWishlist(id);

  const onPressWishlist = useCallback(() => {
    if (wishlisted) {
      removeFromWishlist(id, {
        onError: () => {
          Alert.alert('Error', 'Fail to remove from wishlist');
        },
      });
    } else {
      addToWishlist(id, {
        onError: () => {
          Alert.alert('Error', 'Fail to add to wishlist');
        },
      });
    }
  }, [wishlisted, id, removeFromWishlist, addToWishlist]);

  const onPressAddToCart = useCallback(
    (productId: string, productName: string) => {
      addToCart(
        { productId, quantity },
        {
          onSuccess: () => {
            Alert.alert('Success', `${productName} added to cart!`);
          },
          onError: (error: any) => {
            Alert.alert('Error', error?.response?.data?.error || 'Failed to add to cart');
          },
        }
      );
    },
    [quantity, addToCart]
  );

  // Derived state evaluations
  const reviewUnit = item && item.totalReviews > 1 ? ' reviews' : ' review';
  const imageList = item?.images || [];
  const totalPrice = (item?.price ?? 0) * quantity;
  const isDeductDisabled = quantity === 1;
  const isAddDisabled = item ? quantity >= item.stock : true;

  const handleIncrementQuantity = () => setQuantity((prev) => prev + 1);
  const handleDecrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  return {
    id,
    item,
    isLoading,
    isError,
    quantity,
    selectedImageIndex,
    setSelectedImageIndex,
    wishlisted,
    isAddingToWishlist,
    isRemovingFromWishlist,
    isAddingToCart,
    reviewUnit,
    imageList,
    totalPrice,
    isDeductDisabled,
    isAddDisabled,
    onPressWishlist,
    onPressAddToCart,
    handleIncrementQuantity,
    handleDecrementQuantity,
  };
}

describe('ProductDetailScreen Data State & Logic', () => {
  const mockProductId = 'prod-123';
  const mockProduct = {
    _id: mockProductId,
    name: 'Wireless Headphones',
    price: 99.99,
    stock: 5,
    averageRating: 4.5,
    totalReviews: 2,
    images: ['img1.jpg', 'img2.jpg'],
    category: 'Electronics',
    description: 'Noise cancelling',
  };

  const defaultWishlistMock = {
    isExistInWishlist: jest.fn().mockReturnValue(false),
    addToWishlist: jest.fn(),
    isAddingToWishlist: false,
    removeFromWishlist: jest.fn(),
    isRemovingFromWishlist: false,
  };

  const defaultCartMock = {
    addToCart: jest.fn(),
    isAddingToCart: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLocalSearchParams.mockReturnValue({ id: mockProductId });
    mockUseWishlist.mockReturnValue(defaultWishlistMock);
    mockUseCart.mockReturnValue(defaultCartMock);
  });

  describe('Loading and Error Data States', () => {
    it('should reflect loading data state when fetching product', async () => {
      mockUseProduct.mockReturnValue({ data: undefined, isLoading: true, isError: false });

      const { result } = await renderHook(() => useProductDetailDataState());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.item).toBeUndefined();
    });

    it('should reflect error state when product fetch fails', async () => {
      mockUseProduct.mockReturnValue({ data: undefined, isLoading: false, isError: true });

      const { result } = await renderHook(() => useProductDetailDataState());

      expect(result.current.isError).toBe(true);
      expect(result.current.item).toBeUndefined();
    });
  });

  describe('Derived Calculations & Text Formats', () => {
    it('should correctly derive plurality for reviews (plural > 1)', async () => {
      mockUseProduct.mockReturnValue({ data: mockProduct, isLoading: false, isError: false });

      const { result } = await renderHook(() => useProductDetailDataState());

      expect(result.current.reviewUnit).toBe(' reviews');
    });

    it('should correctly derive plurality for reviews (singular = 1)', async () => {
      mockUseProduct.mockReturnValue({
        data: { ...mockProduct, totalReviews: 1 },
        isLoading: false,
        isError: false,
      });

      const { result } = await renderHook(() => useProductDetailDataState());

      expect(result.current.reviewUnit).toBe(' review');
    });

    it('should compute initial total price based on default quantity (1)', async () => {
      mockUseProduct.mockReturnValue({ data: mockProduct, isLoading: false, isError: false });

      const { result } = await renderHook(() => useProductDetailDataState());

      expect(result.current.totalPrice).toBe(99.99);
    });

    it('should calculate updated total price when quantity changes', async () => {
      mockUseProduct.mockReturnValue({ data: mockProduct, isLoading: false, isError: false });

      const { result } = await renderHook(() => useProductDetailDataState());

      act(() => {
        result.current.handleIncrementQuantity();
      });

      expect(result.current.quantity).toBe(2);
      expect(result.current.totalPrice).toBe(199.98);
    });
  });

  describe('Quantity Control Logic & Constraints', () => {
    it('should disable deduct action when quantity is 1', async () => {
      mockUseProduct.mockReturnValue({ data: mockProduct, isLoading: false, isError: false });

      const { result } = await renderHook(() => useProductDetailDataState());

      expect(result.current.quantity).toBe(1);
      expect(result.current.isDeductDisabled).toBe(true);
    });

    it('should disable add action when quantity reaches available stock', async () => {
      mockUseProduct.mockReturnValue({
        data: { ...mockProduct, stock: 2 },
        isLoading: false,
        isError: false,
      });

      const { result } = await renderHook(() => useProductDetailDataState());

      act(() => {
        result.current.handleIncrementQuantity();
      });

      expect(result.current.quantity).toBe(2);
      expect(result.current.isAddDisabled).toBe(true);
    });
  });

  describe('Wishlist State Actions & Logic', () => {
    it('should call addToWishlist when item is not in wishlist', async () => {
      const addToWishlistMock = jest.fn();
      mockUseProduct.mockReturnValue({ data: mockProduct, isLoading: false, isError: false });
      mockUseWishlist.mockReturnValue({
        ...defaultWishlistMock,
        isExistInWishlist: jest.fn().mockReturnValue(false),
        addToWishlist: addToWishlistMock,
      });

      const { result } = await renderHook(() => useProductDetailDataState());

      act(() => {
        result.current.onPressWishlist();
      });

      expect(addToWishlistMock).toHaveBeenCalledWith(mockProductId, expect.any(Object));
    });

    it('should call removeFromWishlist when item is already in wishlist', async () => {
      const removeFromWishlistMock = jest.fn();
      mockUseProduct.mockReturnValue({ data: mockProduct, isLoading: false, isError: false });
      mockUseWishlist.mockReturnValue({
        ...defaultWishlistMock,
        isExistInWishlist: jest.fn().mockReturnValue(true),
        removeFromWishlist: removeFromWishlistMock,
      });

      const { result } = await renderHook(() => useProductDetailDataState());

      act(() => {
        result.current.onPressWishlist();
      });

      expect(removeFromWishlistMock).toHaveBeenCalledWith(mockProductId, expect.any(Object));
    });

    it('should trigger Alert onError when addToWishlist callback fails', async () => {
      const addToWishlistMock = jest.fn((id, options) => {
        options?.onError?.();
      });

      mockUseProduct.mockReturnValue({ data: mockProduct, isLoading: false, isError: false });
      mockUseWishlist.mockReturnValue({
        ...defaultWishlistMock,
        isExistInWishlist: jest.fn().mockReturnValue(false),
        addToWishlist: addToWishlistMock,
      });

      const { result } = await renderHook(() => useProductDetailDataState());

      act(() => {
        result.current.onPressWishlist();
      });

      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Fail to add to wishlist');
    });
  });

  describe('Cart Actions & Logic', () => {
    it('should trigger addToCart with target productId and selected quantity', async () => {
      const addToCartMock = jest.fn();
      mockUseProduct.mockReturnValue({ data: mockProduct, isLoading: false, isError: false });
      mockUseCart.mockReturnValue({
        ...defaultCartMock,
        addToCart: addToCartMock,
      });

      const { result } = await renderHook(() => useProductDetailDataState());

      act(() => {
        result.current.handleIncrementQuantity(); // quantity = 2
      });

      act(() => {
        result.current.onPressAddToCart(mockProduct._id, mockProduct.name);
      });

      expect(addToCartMock).toHaveBeenCalledWith(
        { productId: mockProductId, quantity: 2 },
        expect.any(Object)
      );
    });

    it('should trigger success Alert on successful cart addition', async () => {
      const addToCartMock = jest.fn((payload, options) => {
        options?.onSuccess?.();
      });

      mockUseProduct.mockReturnValue({ data: mockProduct, isLoading: false, isError: false });
      mockUseCart.mockReturnValue({
        ...defaultCartMock,
        addToCart: addToCartMock,
      });

      const { result } = await renderHook(() => useProductDetailDataState());

      act(() => {
        result.current.onPressAddToCart(mockProduct._id, mockProduct.name);
      });

      expect(Alert.alert).toHaveBeenCalledWith('Success', `${mockProduct.name} added to cart!`);
    });

    it('should handle custom error message from backend when addToCart fails', async () => {
      const errorMessage = 'Out of stock limit reached';
      const addToCartMock = jest.fn((payload, options) => {
        options?.onError?.({ response: { data: { error: errorMessage } } });
      });

      mockUseProduct.mockReturnValue({ data: mockProduct, isLoading: false, isError: false });
      mockUseCart.mockReturnValue({
        ...defaultCartMock,
        addToCart: addToCartMock,
      });

      const { result } = await renderHook(() => useProductDetailDataState());

      act(() => {
        result.current.onPressAddToCart(mockProduct._id, mockProduct.name);
      });

      expect(Alert.alert).toHaveBeenCalledWith('Error', errorMessage);
    });
  });
});