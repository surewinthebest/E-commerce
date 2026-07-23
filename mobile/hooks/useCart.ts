import { useApi } from "@/lib/api";
import { Cart } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const useCart = () => {
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

    const { data: cart, isLoading, isError } = useQuery({
        queryKey: ["cart"],
        queryFn: async () => {
            const { data } = await api.get<{ cart: Cart }>("/cart");
            return data.cart;
        }
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

    const cartTotal =
        cart?.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0) ?? 0;

    const cartItemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

    const shipping = 10.0; // $10 shipping fee
    const tax = cartTotal * 0.08; // 8% tax
    const total = cartTotal + shipping + tax;

    return {
        cart,
        isLoading,
        isError,
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

export default useCart;

