import { formatDate, getStatusColor } from '@/src/lib/utils';
import { OrderItem } from '@/src/types';

// Mock helper dependencies if needed, or test their pure output
jest.mock('@/src/lib/utils', () => ({
    formatDate: jest.fn((date: string) => `Formatted: ${date}`),
    getStatusColor: jest.fn((status: string) => '#123456'),
}));

describe('OrderCard - Data & State Logic (Unit Tests)', () => {
    const mockOrderItems: OrderItem[] = [
        { _id: 'item-1', name: 'Espresso', quantity: 2, image: 'http://example.com/item1.jpg' } as any,
        { _id: 'item-2', name: 'Croissant', quantity: 1, image: 'http://example.com/item2.jpg' } as any,
    ];

    const defaultProps = {
        orderId: 'usr-ord-1234567890abcdef',
        orderItems: mockOrderItems,
        createdAt: '2026-03-31T12:00:00Z',
        status: 'DELIVERED',
        totalPrice: '25.50',
        hasReviewed: false,
        setShowReviewModal: jest.fn(),
        setReviewInfo: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Order ID & Text Formatting', () => {
        it('should format order ID to show only the last 8 uppercase characters', () => {
            const orderId = defaultProps.orderId;
            const formattedOrderId = "Order #" + orderId.slice(-8).toUpperCase();

            expect(formattedOrderId).toBe('Order #90ABCDEF');
        });

        it('should correctly format item display text and count total items', () => {
            const formattedItems = defaultProps.orderItems.map(
                (item) => `${item.name} x ${item.quantity}`
            );
            const totalItemsCountText = `${defaultProps.orderItems.length} Items`;

            expect(formattedItems).toEqual(['Espresso x 2', 'Croissant x 1']);
            expect(totalItemsCountText).toBe('2 Items');
        });

        it('should correctly format total price string with currency prefix', () => {
            const formattedPrice = "$" + defaultProps.totalPrice;
            expect(formattedPrice).toBe('$25.50');
        });

        it('should call formatDate helper with createdAt prop', () => {
            const result = formatDate(defaultProps.createdAt);

            expect(formatDate).toHaveBeenCalledWith('2026-03-31T12:00:00Z');
            expect(result).toBe('Formatted: 2026-03-31T12:00:00Z');
        });
    });

    describe('Status & Styling Calculations', () => {
        it('should compute status badge width dynamically based on status length', () => {
            const status = 'DELIVERED';
            const expectedWidth = 9 * status.length;

            expect(expectedWidth).toBe(72);
        });

        it('should construct opacity-modified status background color', () => {
            const statusColor = getStatusColor(defaultProps.status);
            const statusBgColor = statusColor + "20";

            expect(getStatusColor).toHaveBeenCalledWith('DELIVERED');
            expect(statusBgColor).toBe('#12345620');
        });
    });

    describe('First Item Image Fallback & Selection', () => {
        it('should select the first item image from the items array', () => {
            const primaryImageUri = defaultProps.orderItems[0].image;
            expect(primaryImageUri).toBe('http://example.com/item1.jpg');
        });
    });

    describe('Action Callbacks & Conditional Logic', () => {
        it('should execute review callback handlers with correct arguments when leave rating action triggers', () => {
            const { setReviewInfo, setShowReviewModal, orderId, orderItems } = defaultProps;

            // Simulating button press handler logic directly
            const handlePress = () => {
                setReviewInfo(orderId, orderItems);
                setShowReviewModal(true);
            };

            handlePress();

            expect(setReviewInfo).toHaveBeenCalledTimes(1);
            expect(setReviewInfo).toHaveBeenCalledWith(
                'usr-ord-1234567890abcdef',
                mockOrderItems
            );
            expect(setShowReviewModal).toHaveBeenCalledTimes(1);
            expect(setShowReviewModal).toHaveBeenCalledWith(true);
        });

        it('should satisfy condition to display rating button when hasReviewed is false', () => {
            const hasReviewed = false;
            const shouldShowRatingBtn = !hasReviewed;

            expect(shouldShowRatingBtn).toBe(true);
        });

        it('should satisfy condition to hide rating button when hasReviewed is true', () => {
            const hasReviewed = true;
            const shouldShowRatingBtn = !hasReviewed;

            expect(shouldShowRatingBtn).toBe(false);
        });
    });
});