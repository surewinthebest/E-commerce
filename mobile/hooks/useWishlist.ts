import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Product } from "@/types";
import { useApi } from "@/lib/api";

const useWishlist = () => {
    const api = useApi();
    const queryClient = useQueryClient();

    const { data: wishlist, isLoading, isError } = useQuery({
        queryKey: ["wishlist"],
        queryFn: async () => {
            const { data } = await api.get<{ wishlist: Product[] }>("/users/wishlist");
            return data.wishlist
        }
    })

    const addToWishlist = useMutation({
        mutationKey: ["wishlist"],
        mutationFn: async (productId: string) => {
            const { data } = await api.post<{ wishlist: string[] }>("/users/wishlist", { productId });
            return data.wishlist
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["wishlist"] });
        }
    })

    const removeFromWishlist = useMutation({
        mutationKey: ["wishlist"],
        mutationFn: async (productId: string) => {
            const { data } = await api.delete<{ wishlist: string[] }>(`/users/wishlist/${productId}`);
            return data.wishlist
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["wishlist"] });
        }
    })

    const isExistInWishlist = (productId: string) => {
        return wishlist?.some((product) => product._id === productId) ?? false;
    }

    const toggleWishlist = (productId: string) => {
        if (isExistInWishlist(productId)) {
            return removeFromWishlist.mutate(productId);
        } else {
            return addToWishlist.mutate(productId);
        }
    }

    return {
        wishlist: wishlist || [],
        isLoading,
        isError,
        wishlistCount: wishlist?.length || 0,
        isExistInWishlist,
        toggleWishlist,
        addToWishlist: addToWishlist.mutate,
        removeFromWishlist: removeFromWishlist.mutate,
        isAddingToWishlist: addToWishlist.isPending,
        isRemovingFromWishlist: removeFromWishlist.isPending,
    }
}

export default useWishlist;