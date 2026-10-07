import { useApi } from "@/src/lib/api";
import { Product } from "@/src/types";
import { useQuery } from "@tanstack/react-query";
import { CACHE_KEYS, CacheManager } from "../lib/cache";


const useProducts = () => {
    const api = useApi();
    const result = useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            const { data } = await api.get<{ products: Product[] }>("/products");
            CacheManager.setObject(CACHE_KEYS.PRODUCTS, data.products);
            return data.products;
        },
        initialData: () => CacheManager.getObject(CACHE_KEYS.PRODUCTS) ?? undefined,
    })
    return result;
}

export default useProducts;