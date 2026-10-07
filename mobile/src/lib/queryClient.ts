import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import * as Sentry from "@sentry/react-native";

interface QueryClientOptions {
  onServerError?: (isDown: boolean) => void;
}

export function createQueryClient({ onServerError }: QueryClientOptions = {}) {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error: any, query) => {
        Sentry.captureException(error, {
          tags: {
            type: "react-query-error",
            queryKey: query.queryKey[0]?.toString() || "unknown",
          },
          extra: {
            errorMessage: error.message,
            statusCode: error.response?.status,
            queryKey: query.queryKey,
          },
        });

        if (error?.response?.status >= 500) {
          onServerError?.(true);
        }
      },
      onSuccess: () => {
        onServerError?.(false);
      },
    }),
    mutationCache: new MutationCache({
      onError: (error: any) => {
        Sentry.captureException(error, {
          tags: { type: "react-query-mutation-error" },
          extra: {
            errorMessage: error.message,
            statusCode: error.response?.status,
          },
        });

        if (error?.response?.status >= 500) {
          onServerError?.(true);
        }
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
      },
    },
  });
}