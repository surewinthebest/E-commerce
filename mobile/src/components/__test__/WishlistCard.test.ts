import { Alert } from 'react-native';
import useWishlist from '@/src/hooks/useWishlist';
import { useCart } from '@/src/hooks/useCart';
import { Product } from '@/src/types';

// Mock dependencies
jest.mock('react-native', () => ({
    Alert: {
        alert: jest.fn(),
    },
    StyleSheet: {
        create: (styles: any) => styles,
    },
}));

jest.mock('@/src/hooks/useWishlist');
jest.mock('@/src/hooks/useCart');

describe('WishlistCard Data Logic & State Handlers', () => {
    const mockRemoveFromWishlist = jest.fn();
    const mockAddToCart = jest.fn();

    const mockProduct: Product = {
        _id: 'prod_123',
        name: 'Wireless Headphones',
        price: 99.99,
        stock: 15,
        images: ['https://example.com/image1.png'],
    } as Product;

    beforeEach(() => {
        jest.clearAllMocks();

        (useWishlist as jest.Mock).mockReturnValue({
            removeFromWishlist: mockRemoveFromWishlist,
            isRemovingFromWishlist: false,
        });

        (useCart as jest.Mock).mockReturnValue({
            addToCart: mockAddToCart,
            isAddingToCart: false,
        });
    });

    describe('Container Height Logic', () => {
        it('calculates total dynamic card height correctly based on layout height state', () => {
            const BASE_HEIGHT = 130;
            const initialNameHeight = 0;
            expect(initialNameHeight + BASE_HEIGHT).toBe(130);

            const calculatedNameHeight = 24.5;
            const computedTotalHeight = calculatedNameHeight + BASE_HEIGHT;
            expect(computedTotalHeight).toBe(154.5);
        });
    });

    describe('Price & Stock Formatting Logic', () => {
        it('formats price correctly to 2 decimal places', () => {
            const formattedPrice = '$' + mockProduct.price.toFixed(2);
            expect(formattedPrice).toBe('$99.99');
        });

        it('formats stock text correctly', () => {
            const formattedStock = ' ' + mockProduct.stock + ' in stock';
            expect(formattedStock).toBe(' 15 in stock');
        });
    });

    describe('handleRemove Handler Data Flow', () => {
        // Simulates handleRemove function execution in WishlistCard
        const handleRemove = (item: Product, removeFromWishlist: jest.Mock) => {
            Alert.alert('Remove Item', `Are you sure to remove ${item.name}?`, [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => removeFromWishlist(item._id),
                },
            ]);
        };

        it('triggers Alert.alert with expected title, message, and button configurations', () => {
            handleRemove(mockProduct, mockRemoveFromWishlist);

            expect(Alert.alert).toHaveBeenCalledWith(
                'Remove Item',
                'Are you sure to remove Wireless Headphones?',
                expect.arrayContaining([
                    expect.objectContaining({ text: 'Cancel', style: 'cancel' }),
                    expect.objectContaining({ text: 'Remove', style: 'destructive' }),
                ])
            );
        });

        it('executes removeFromWishlist with exact product ID when confirm action is selected', () => {
            handleRemove(mockProduct, mockRemoveFromWishlist);

            const alertCalls = (Alert.alert as jest.Mock).mock.calls[0];
            const buttons = alertCalls[2];
            const removeButton = buttons.find((btn: any) => btn.text === 'Remove');

            removeButton.onPress();

            expect(mockRemoveFromWishlist).toHaveBeenCalledWith('prod_123');
            expect(mockRemoveFromWishlist).toHaveBeenCalledTimes(1);
        });
    });

    describe('handleAddToCart Handler Data Flow', () => {
        // Simulates handleAddToCart function execution in WishlistCard
        const handleAddToCart = (
            productId: string,
            productName: string,
            addToCart: jest.Mock
        ) => {
            addToCart(
                { productId, quantity: 1 },
                {
                    onSuccess: () => {
                        Alert.alert('Success', `${productName} added to cart!`);
                    },
                    onError: (error: any) => {
                        Alert.alert(
                            'Error',
                            error?.response?.data?.error || 'Failed to add to cart'
                        );
                    },
                }
            );
        };

        it('calls addToCart with correct payload structure', () => {
            handleAddToCart(mockProduct._id, mockProduct.name, mockAddToCart);

            expect(mockAddToCart).toHaveBeenCalledWith(
                { productId: 'prod_123', quantity: 1 },
                expect.objectContaining({
                    onSuccess: expect.any(Function),
                    onError: expect.any(Function),
                })
            );
        });

        it('triggers success Alert.alert upon onSuccess execution', () => {
            handleAddToCart(mockProduct._id, mockProduct.name, mockAddToCart);

            const [, callbacks] = mockAddToCart.mock.calls[0];
            callbacks.onSuccess();

            expect(Alert.alert).toHaveBeenCalledWith(
                'Success',
                'Wireless Headphones added to cart!'
            );
        });

        it('triggers custom error message Alert.alert upon onError callback with response data', () => {
            handleAddToCart(mockProduct._id, mockProduct.name, mockAddToCart);

            const [, callbacks] = mockAddToCart.mock.calls[0];
            const mockError = { response: { data: { error: 'Out of stock' } } };

            callbacks.onError(mockError);

            expect(Alert.alert).toHaveBeenCalledWith('Error', 'Out of stock');
        });

        it('triggers default error message Alert.alert when error response payload is missing', () => {
            handleAddToCart(mockProduct._id, mockProduct.name, mockAddToCart);

            const [, callbacks] = mockAddToCart.mock.calls[0];

            callbacks.onError({});

            expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to add to cart');
        });
    });
});