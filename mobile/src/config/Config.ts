import Config from "react-native-config";

export type EnvType = "dev" | "staging" | "production";

interface configReturn {
    env: EnvType;
    ExpoPublicClerkPublishableKey: string;
    ExpoPublicApiUrl: string;
    SentryAuthToken: string;
    SentryDsn: string;
    ExpoPublicStripePublishableKey: string;
}

function makeConfig(): configReturn {
    return {
        env: Config.EXPO_PUBLIC_APP_ENV as EnvType,
        ExpoPublicClerkPublishableKey: Config.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "",
        ExpoPublicApiUrl: Config.EXPO_PUBLIC_API_URL ?? "",
        SentryAuthToken: Config.SENTRY_AUTH_TOKEN ?? "",
        SentryDsn: Config.SENTRY_DSN ?? "",
        ExpoPublicStripePublishableKey: Config.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
    };
}

const config = makeConfig();
export default config;