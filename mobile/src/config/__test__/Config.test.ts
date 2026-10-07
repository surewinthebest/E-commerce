import config from "@/src/config/Config";
describe("Config module", () => {
    beforeEach(() => {
      jest.resetModules();
    });
  
    it("should populate config correctly when all react-native-config values are present", () => {
      jest.doMock("react-native-config", () => ({
        ENV: "staging",
        EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_123",
        EXPO_API_URL: "https://api.staging.example.com",
        SENTRY_AUTH_TOKEN: "sentry_token_123",
        SENTRY_DSN: "https://dsn@sentry.io/123",
        EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY: "pk_stripe_123",
      }));
  
      jest.isolateModules(() => {
        expect(config).toEqual({
          env: "staging",
          ExpoPublicClerkPublishableKey: "pk_test_123",
          ExpoPublicApiUrl: "https://api.staging.example.com",
          SentryAuthToken: "sentry_token_123",
          SentryDsn: "https://dsn@sentry.io/123",
          ExpoPublicStripePublishableKey: "pk_stripe_123",
        });
      });
    });
  
    it("should fall back to empty strings when optional keys are missing or undefined", () => {
      jest.doMock("react-native-config", () => ({
        ENV: "dev",
      }));
  
      jest.isolateModules(() => {
        expect(config).toEqual({
          env: "dev",
          ExpoPublicClerkPublishableKey: "",
          ExpoPublicApiUrl: "",
          SentryAuthToken: "",
          SentryDsn: "",
          ExpoPublicStripePublishableKey: "",
        });
      });
    });
  });