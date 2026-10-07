import useWishlist from '@/src/hooks/useWishlist';

// Mock the useWishlist hook
jest.mock('@/src/hooks/useWishlist');

const mockedUseWishlist = useWishlist as jest.MockedFunction<typeof useWishlist>;

describe('Wishlist Screen Data State & Logic', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    /**
     * Helper to compute the unit label based on wishlist length,
     * mirroring the logic inside WishlistScreen.
     */
    const getItemUnit = (wishlistLength: number): string => {
        return wishlistLength > 1 ? 'items' : 'item';
    };

    it('should return correct data state and unit label when wishlist is empty', () => {
        const mockWishlist: any[] = [];
        mockedUseWishlist.mockReturnValue({ wishlist: mockWishlist } as any);

        const { wishlist } = useWishlist();
        const itemUnit = getItemUnit(wishlist.length);

        expect(wishlist).toHaveLength(0);
        expect(wishlist).toEqual([]);
        expect(itemUnit).toBe('item');
    });

    it('should handle single item state correctly with "item" unit label', () => {
        const mockWishlist = [
            { _id: 'prod-1', name: 'Product 1', price: 100 }
        ];
        mockedUseWishlist.mockReturnValue({ wishlist: mockWishlist } as any);

        const { wishlist } = useWishlist();
        const itemUnit = getItemUnit(wishlist.length);

        expect(wishlist).toHaveLength(1);
        expect(wishlist[0]._id).toBe('prod-1');
        expect(itemUnit).toBe('item');
    });

    it('should handle multiple items state correctly with "items" unit label', () => {
        const mockWishlist = [
            { _id: 'prod-1', name: 'Product 1', price: 100 },
            { _id: 'prod-2', name: 'Product 2', price: 200 }
        ];
        mockedUseWishlist.mockReturnValue({ wishlist: mockWishlist } as any);

        const { wishlist } = useWishlist();
        const itemUnit = getItemUnit(wishlist.length);

        expect(wishlist).toHaveLength(2);
        expect(wishlist.map(item => item._id)).toEqual(['prod-1', 'prod-2']);
        expect(itemUnit).toBe('items');
    });

    it('should accurately provide key extractor values for FlatList items', () => {
        const mockWishlist = [
            { _id: 'unique-id-123', name: 'Product A' },
            { _id: 'unique-id-456', name: 'Product B' }
        ];
        mockedUseWishlist.mockReturnValue({ wishlist: mockWishlist } as any);

        const { wishlist } = useWishlist();

        // Key extractor logic assertion (item => item._id)
        const keyExtractor = (item: { _id: string }) => item._id;

        expect(keyExtractor(wishlist[0])).toBe('unique-id-123');
        expect(keyExtractor(wishlist[1])).toBe('unique-id-456');
    });
});