import { useApi } from "@/lib/api";
import { Product } from "@/types";
import { useQuery } from "@tanstack/react-query";

const useProduct = (productId: String) => {
    const api = useApi();

    const result = useQuery<Product>({
        queryKey: ["product", productId],
        queryFn: async () => {
            const { data } = await api.get(`/products/${productId}`);
            return data.product;
        },
        enabled: !!productId,
    })

    return result;
}

export default useProduct;