import { useApi } from "@/src/lib/api";
import { Product } from "@/src/types";
import { useQuery } from "@tanstack/react-query";

const useProduct = (productId: string) => {
    const api = useApi();

    const result = useQuery<Product>({
        queryKey: ["product", productId],
        queryFn: async () => {
            const { data } = await api.get(`/products/${productId}`);
            return data.product;
        },
        refetchOnWindowFocus: false,
        enabled: !!productId,
    })

    return result;
}

export default useProduct;