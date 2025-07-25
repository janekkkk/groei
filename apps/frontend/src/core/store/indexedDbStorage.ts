import { del, get, set } from "idb-keyval";
import type { StorageValue } from "zustand/middleware";

export interface SyncInfo {
  lastSyncTimestamp: number;
  isPendingSync: boolean;
}

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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(value.state).filter(([_, v]) => typeof v !== "function"),
    );

    // Add sync metadata
    const syncInfo: SyncInfo = {
      lastSyncTimestamp: Date.now(),
      isPendingSync: true,
    };

    await set(name, { version: value.version, state, syncInfo });

    // Dispatch a sync event that can be listened to by sync handlers
    window.dispatchEvent(
      new CustomEvent("store-updated", {
        detail: { storeName: name, syncInfo },
      }),
    );
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

// Helper function to check if we need to sync with the backend
export const shouldSyncWithBackend = async (
  storeName: string,
): Promise<boolean> => {
  const storedData = await get(storeName);
  if (!storedData) return true;

  const { syncInfo } = storedData as { syncInfo?: SyncInfo };
  if (!syncInfo) return true;

  // If we have pending changes or it's been more than 5 minutes since last sync
  return (
    syncInfo.isPendingSync ||
    Date.now() - syncInfo.lastSyncTimestamp > 5 * 60 * 1000
  );
};

// Mark store as synced
export const markStoreSynced = async (storeName: string): Promise<void> => {
  const storedData = await get(storeName);
  if (!storedData) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = storedData as any;
  const syncInfo: SyncInfo = {
    lastSyncTimestamp: Date.now(),
    isPendingSync: false,
  };

  await set(storeName, {
    ...data,
    syncInfo,
  });
};
