// CartSummaryCard.test.ts
import { useCart } from '@/src/hooks/useCart';

// Mock the useCart hook
jest.mock('@/src/hooks/useCart');

const mockedUseCart = useCart as jest.MockedFunction<typeof useCart>;

/**
 * Pure data mapping & formatting logic extracted from CartSummaryCard
 */
const useCartSummaryData = () => {
    const { cartTotal: subtotal, shipping, tax, total } = useCart();

    const summary = [
        { name: "Subtotal", value: `$${subtotal.toFixed(2)}` },
        { name: "Shipping", value: `$${shipping.toFixed(2)}` },
        { name: "Tax", value: `$${tax.toFixed(2)}` }
    ];

    const formattedTotal = `$${total.toFixed(2)}`;

    return {
        summary,
        total: formattedTotal,
    };
};

describe('CartSummaryCard Data State', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should format standard cart values correctly with two decimal places', () => {
        mockedUseCart.mockReturnValue({
            cartTotal: 100,
            shipping: 10,
            tax: 8.5,
            total: 118.5,
        } as ReturnType<typeof useCart>);

        const result = useCartSummaryData();

        expect(result.summary).toEqual([
            { name: 'Subtotal', value: '$100.00' },
            { name: 'Shipping', value: '$10.00' },
            { name: 'Tax', value: '$8.50' },
        ]);
        expect(result.total).toBe('$118.50');
    });

    it('should correctly format zero values', () => {
        mockedUseCart.mockReturnValue({
            cartTotal: 0,
            shipping: 0,
            tax: 0,
            total: 0,
        } as ReturnType<typeof useCart>);

        const result = useCartSummaryData();

        expect(result.summary).toEqual([
            { name: 'Subtotal', value: '$0.00' },
            { name: 'Shipping', value: '$0.00' },
            { name: 'Tax', value: '$0.00' },
        ]);
        expect(result.total).toBe('$0.00');
    });

    it('should correctly round floating numbers to 2 decimal places', () => {
        mockedUseCart.mockReturnValue({
            cartTotal: 19.999,
            shipping: 5.505,
            tax: 1.624,
            total: 27.128,
        } as ReturnType<typeof useCart>);

        const result = useCartSummaryData();

        expect(result.summary).toEqual([
            { name: 'Subtotal', value: '$20.00' },
            { name: 'Shipping', value: '$5.51' },
            { name: 'Tax', value: '$1.62' },
        ]);
        expect(result.total).toBe('$27.13');
    });
});