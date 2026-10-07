import { MMKV } from "react-native-mmkv";

export const storage = new MMKV();

export const CACHE_KEYS = {
  USER_PROFILE: "cache.user_profile",
  CART: "cache.cart",
  WISHLIST: "cache.wishlist",
  ADDRESSES: "cache.addresses",
  PRODUCTS: "cache.products",
  ORDERS: "cache.orders",
} as const;


export const CacheManager = {
  setObject: <T>(key: string, value: T): void => {
    try {
      storage.set(key, JSON.stringify(value));
    } catch (error) {
      console.error(`MMKV Set Error [${key}]:`, error);
    }
  },

  getObject: <T>(key: string): T | null => {
    try {
      const json = storage.getString(key);
      return json ? (JSON.parse(json) as T) : null;
    } catch (error) {
      console.error(`MMKV Get Error [${key}]:`, error);
      return null;
    }
  },

  remove: (key: string): void => {
    try {
      storage.delete(key);
    } catch (error) {
      console.error(`MMKV Delete Error [${key}]:`, error);
    }
  },

  clearAll: (): void => {
    try {
      storage.clearAll();
    } catch (error) {
      console.error("MMKV Clear Error:", error);
    }
  },
};