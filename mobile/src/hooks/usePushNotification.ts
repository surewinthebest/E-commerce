import { useApi } from '@/src/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';


const usePushNotification = () => {
    const api = useApi();
    const queryClient = useQueryClient();

    const syncPushToken = useMutation({
        mutationFn: async (token: string) => {
            const response = await api.put("/users/push-token", { token });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });

    const { data: notifications, isLoading, isError } = useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            const { data } = await api.get<{ notification: Notification }>("/notifications/history");
            return data;
        },
        refetchOnWindowFocus: false,
    });

    return {
        notifications,
        isLoadingNoti: isLoading,
        isErrorNoti: isError,
        syncPushToken: syncPushToken.mutateAsync,
        isSyncing: syncPushToken.isPending,
    }
}

export default usePushNotification;