import { useApi } from "@/src/lib/api";
import { Cart } from "@/src/types";
import { UseMutateFunction, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CACHE_KEYS, CacheManager } from "../lib/cache";

export interface UseCartReturn {
    // Data & Loading States
    cart: Cart | undefined;
    isLoading: boolean;
    isError: boolean;
    refetch: () => Promise<void>;
    isRefetching: boolean;

    // Financial Calculations & Totals
    cartTotal: number;
    shipping: number;
    tax: number;
    total: number;
    cartItemCount: number;

    // Mutation Actions
    addToCart: UseMutateFunction<
        Cart,
        Error,
        { productId: string; quantity?: number },
        unknown
    >;
    updateItemQuantity: UseMutateFunction<
        Cart,
        Error,
        { productId: string; quantity: number },
        unknown
    >;
    removeCartItems: UseMutateFunction<
        any,
        Error,
        string,
        unknown
    >;
    deleteCart: () => Promise<any>;

    // Mutation Statuses
    isAddingToCart: boolean;
    isUpdating: boolean;
    isRemoving: boolean;
    isClearing: boolean;
}

export function useCart(): UseCartReturn {
    const api = useApi();
    const queryClient = useQueryClient();

    const addToCart = useMutation({
        mutationKey: ["cart"],
        mutationFn: async ({ productId, quantity = 1 }: { productId: string, quantity?: number }) => {
            const { data } = await api.post<{ cart: Cart }>("/cart", { productId, quantity });
            return data.cart;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
        onError: (error: any) => {
            return error.data.error;
        }
    });

    const cartQuery = useQuery({
        queryKey: ["cart"],
        queryFn: async () => {
            const { data } = await api.get<{ cart: Cart }>("/cart");
            CacheManager.setObject(CACHE_KEYS.CART, data.cart);
            return data.cart;
        },
        initialData: () => CacheManager.getObject(CACHE_KEYS.CART) ?? undefined,
    });

    const updateItemQuantity = useMutation({
        mutationFn: async ({ productId, quantity = 1 }: { productId: string, quantity: number }) => {
            const { data } = await api.put<{ cart: Cart }>(`/cart/${productId}`, { quantity })
            return data.cart;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        }
    });

    const removeCartItems = useMutation({
        mutationFn: async (productId: string) => {
            const result = await api.delete<{ cart: Cart }>(`/cart/${productId}`)
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        }
    });

    const deleteCart = useMutation({
        mutationKey: ["cart"],
        mutationFn: async () => {
            const result = await api.delete<{ cart: Cart }>("/cart")
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        }
    });

    const cart = cartQuery.data;

    const cartTotal =
        cart?.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0) ?? 0;

    const cartItemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

    const shipping = 10.0; // $10 shipping fee
    const tax = cartTotal * 0.08; // 8% tax
    const total = cartTotal + shipping + tax;

    return {
        cart,
        isLoading: cartQuery.isLoading,
        isError: cartQuery.isError,
        refetch: async () => {
            await cartQuery.refetch();
        },
        isRefetching: cartQuery.isRefetching,
        cartTotal,
        shipping,
        tax,
        total,
        cartItemCount,
        addToCart: addToCart.mutate,
        updateItemQuantity: updateItemQuantity.mutate,
        removeCartItems: removeCartItems.mutate,
        deleteCart: deleteCart.mutateAsync,
        isAddingToCart: addToCart.isPending,
        isUpdating: updateItemQuantity.isPending,
        isRemoving: removeCartItems.isPending,
        isClearing: deleteCart.isPending,
    };
};

