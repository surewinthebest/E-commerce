// src/hooks/useUserProfile.ts
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/expo";
import { CacheManager, CACHE_KEYS } from "@/src/lib/cache";
import { useApi } from "@/src/lib/api";

export const useUserProfile = () => {
  // 1. Destructure isLoaded alongside isSignedIn
  const { isLoaded, isSignedIn } = useAuth();
  const api = useApi();

  const query = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await api.get("/users/profile");
      // 💾 Keep MMKV disk cache updated on every success
      CacheManager.setObject(CACHE_KEYS["USER_PROFILE"], data);
      return data;
    },
    // ⚡ 2. ONLY run network fetch when Clerk is FULLY initialized and user is signed in
    enabled: isLoaded && !!isSignedIn,
    refetchOnWindowFocus: false,
    // ⚡ 3. Render MMKV cache immediately (0ms) so UI shows data even while waiting for Clerk
    initialData: () => CacheManager.getObject(CACHE_KEYS["USER_PROFILE"]) ?? undefined,
  });

  return {
    userProfile: query.data,
    loading: query.isLoading,
    refetch: async () => {
      await query.refetch();
    },
  };
};