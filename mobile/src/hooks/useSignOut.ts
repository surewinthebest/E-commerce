// src/hooks/useSignOut.ts
import { useClerk } from "@clerk/expo";
import { useQueryClient } from "@tanstack/react-query";
import { CacheManager, CACHE_KEYS } from "@/src/lib/cache";

export const useSignOut = () => {
  const { signOut } = useClerk();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      // 1. Purge MMKV disk storage
      Object.values(CACHE_KEYS).forEach((key) => CacheManager.remove(key));

      // 2. Clear React Query memory cache
      queryClient.clear();

      // 3. Clear Clerk session
      await signOut();
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  return { handleLogout };
};