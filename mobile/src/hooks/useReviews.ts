import { useApi } from '@/src/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface CreateReviewData {
    productId: string;
    orderId: string;
    rating: number;
}

const useReviews = () => {
    const api = useApi();
    const queryClient = useQueryClient();

    const createReview = useMutation({
        mutationFn: async (data: CreateReviewData) => {
            const response = await api.post("/reviews", { data });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
    });

    return {
        createReviewAsync: createReview.mutateAsync,
        isCreating: createReview.isPending,
    }
}

export default useReviews;