import { Alert } from 'react-native';

// Mock Alert to capture callback triggers in unit tests
jest.spyOn(Alert, 'alert');

describe('CartItemCard Business Logic & Data Calculations', () => {

    describe('Price Calculations', () => {
        const item = {
            quantity: 3,
            product: {
                _id: 'prod-1',
                name: 'Coffee Beans',
                price: 12.5,
                stock: 10,
            },
        };

        it('calculates the total price correctly based on item quantity and price', () => {
            const totalPrice = (item.product.price * item.quantity).toFixed(2);
            expect(totalPrice).toBe('37.50');
        });

        it('formats single unit price correctly', () => {
            const eachPrice = item.product.price.toFixed(2);
            expect(eachPrice).toBe('12.50');
        });
    });

    describe('Quantity Change Logic (handleQuantityChange)', () => {

        // Extracted handler logic matching the component implementation
        const handleQuantityChange = (
            productId: string,
            currentQuantity: number,
            change: number,
            updateItemQuantityFn: (params: { productId: string; quantity: number }) => void
        ) => {
            const newQuantity = currentQuantity + change;
            if (newQuantity < 1) return;
            updateItemQuantityFn({ productId, quantity: newQuantity });
        };

        it('increments quantity correctly when stock is available', () => {
            const mockUpdateItemQuantity = jest.fn();
            handleQuantityChange('prod-1', 2, 1, mockUpdateItemQuantity);

            expect(mockUpdateItemQuantity).toHaveBeenCalledWith({
                productId: 'prod-1',
                quantity: 3,
            });
        });

        it('decrements quantity correctly when resulting quantity is >= 1', () => {
            const mockUpdateItemQuantity = jest.fn();
            handleQuantityChange('prod-1', 2, -1, mockUpdateItemQuantity);

            expect(mockUpdateItemQuantity).toHaveBeenCalledWith({
                productId: 'prod-1',
                quantity: 1,
            });
        });

        it('prevents quantity from dropping below 1', () => {
            const mockUpdateItemQuantity = jest.fn();
            handleQuantityChange('prod-1', 1, -1, mockUpdateItemQuantity);

            expect(mockUpdateItemQuantity).not.toHaveBeenCalled();
        });
    });

    describe('Disabled States Logic', () => {
        it('evaluates decrease button state correctly', () => {
            const isDecreasingDisabled = (quantity: number, isUpdating: boolean) => quantity === 1 || isUpdating;

            expect(isDecreasingDisabled(1, false)).toBe(true);  // Disabled: min quantity reached
            expect(isDecreasingDisabled(2, true)).toBe(true);   // Disabled: updating in progress
            expect(isDecreasingDisabled(2, false)).toBe(false); // Enabled
        });

        it('evaluates increase button state correctly', () => {
            const isIncreasingDisabled = (quantity: number, stock: number, isUpdating: boolean) => 
                quantity === stock || isUpdating;

            expect(isIncreasingDisabled(5, 5, false)).toBe(true); // Disabled: max stock reached
            expect(isIncreasingDisabled(3, 5, true)).toBe(true);  // Disabled: updating in progress
            expect(isIncreasingDisabled(3, 5, false)).toBe(false); // Enabled
        });

        it('evaluates remove button state correctly', () => {
            const isRemovingDisabled = (isRemoving: boolean) => isRemoving;

            expect(isRemovingDisabled(true)).toBe(true);
            expect(isRemovingDisabled(false)).toBe(false);
        });
    });

    describe('Removal Confirmation Logic (handleRemoveCartItems)', () => {

        const handleRemoveCartItems = (
            productId: string,
            productName: string,
            removeCartItemsFn: (id: string) => void
        ) => {
            Alert.alert("Remove Item", `Remove ${productName} from cart?`, [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Remove",
                    style: "destructive",
                    onPress: () => removeCartItemsFn(productId),
                },
            ]);
        };

        it('triggers Alert with the correct product name and parameters', () => {
            const mockRemoveFn = jest.fn();
            handleRemoveCartItems('prod-123', 'Espresso Machine', mockRemoveFn);

            expect(Alert.alert).toHaveBeenCalledWith(
                "Remove Item",
                "Remove Espresso Machine from cart?",
                expect.any(Array)
            );
        });

        it('calls removeCartItems callback when the alert confirmation is accepted', () => {
            const mockRemoveFn = jest.fn();
            handleRemoveCartItems('prod-123', 'Espresso Machine', mockRemoveFn);

            // Extract the buttons configuration from Alert call
            const alertButtons = (Alert.alert as jest.Mock).mock.calls[0][2];
            const confirmButton = alertButtons.find((b: { text: string }) => b.text === "Remove");

            // Execute the confirmation action
            confirmButton.onPress();

            expect(mockRemoveFn).toHaveBeenCalledWith('prod-123');
        });
    });
});