import { del, get, set } from "idb-keyval";
import { StorageValue } from "zustand/middleware";

export const indexedDBStorage = {
  getItem: async (name: string): Promise<unknown | null> => {
    return (await get(name)) || null;
  },
  setItem: async (
    name: string,
    value: StorageValue<Record<string, unknown>>,
  ): Promise<void> => {
    // Pick only keys that are not functions
    const state = Object.fromEntries(
      Object.entries(value.state).filter(([_, v]) => typeof v !== "function"),
    );
    await set(name, { version: value.version, state });
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};
