import { AsyncLocalStorage } from "node:async_hooks";

export const userContextStorage = new AsyncLocalStorage();

export function getUserContext() {
  return userContextStorage.getStore();
}