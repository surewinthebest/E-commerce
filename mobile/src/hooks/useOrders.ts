import { useApi } from '@/src/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Order } from '@/src/types';
import { CACHE_KEYS, CacheManager } from '../lib/cache';

const useOrders = () => {
    const api = useApi();

    return useQuery<Order[]>({
        queryKey: ["orders"],
        queryFn: async () => {
            const { data } = await api.get("/orders");
            CacheManager.setObject(CACHE_KEYS.ORDERS, data.orders);
            return data.orders;
        },
        refetchOnWindowFocus: false,
        initialData: () => CacheManager.getObject(CACHE_KEYS.ORDERS) ?? undefined,
    });
}

export default useOrders;