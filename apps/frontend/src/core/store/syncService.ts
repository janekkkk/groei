// Path: /Users/janekozga/Projects/Personal/groei/apps/frontend/src/core/store/syncService.ts

import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useBedStore } from "@/features/Beds/beds.store";
import { useSeedStore } from "@/features/Seeds/seeds.store";
import { markStoreSynced, shouldSyncWithBackend } from "./indexedDbStorage";

// Base API URL from environment or default
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface SyncConfig {
  storeName: string;
  fetchEndpoint: string;
  fetchFn: () => Promise<never[]>;
  syncFn: (items: never[]) => Promise<void>;
}

/**
 * Service to handle synchronization between IndexedDB and backend
 */
export class SyncService {
  private syncConfigs: SyncConfig[] = [];
  private queryClient: ReturnType<typeof useQueryClient> | null = null;
  private initialized = false;

  constructor() {
    // Listen for store updates to trigger sync
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.addEventListener(
      "store-updated",
      this.handleStoreUpdated.bind(this),
    );
  }

  /**
   * Initialize the sync service with the query client
   */
  initialize(queryClient: ReturnType<typeof useQueryClient>) {
    if (this.initialized) return;

    this.queryClient = queryClient;
    this.initialized = true;

    // Configure sync for beds store
    this.registerSync({
      storeName: "bedStore",
      fetchEndpoint: "/api/beds",
      fetchFn: async () => {
        const response = await fetch(`${API_BASE_URL}/api/bed`);
        if (!response.ok) throw new Error("Failed to fetch beds from server");
        return response.json();
      },
      syncFn: async (beds) => {
        useBedStore.getState().setBeds(beds);
        await markStoreSynced("bedStore");
        this.queryClient?.invalidateQueries({ queryKey: ["beds"] });
      },
    });

    // Configure sync for seeds store
    this.registerSync({
      storeName: "seedStore",
      fetchEndpoint: "/api/seed",
      fetchFn: async () => {
        const response = await fetch(`${API_BASE_URL}/api/seed`);
        if (!response.ok) throw new Error("Failed to fetch seeds from server");
        return response.json();
      },
      syncFn: async (seeds) => {
        useSeedStore.getState().setSeeds(seeds);
        await markStoreSynced("seedStore");
        this.queryClient?.invalidateQueries({ queryKey: ["seeds"] });
      },
    });

    // Run initial sync
    this.syncAll();
  }

  /**
   * Register a new store for synchronization
   */
  registerSync(config: SyncConfig) {
    this.syncConfigs.push(config);
  }

  /**
   * Sync a specific store with the backend
   */
  async syncStore(storeName: string) {
    if (!this.initialized || !this.queryClient) {
      console.warn("Sync service not initialized yet");
      return;
    }

    const config = this.syncConfigs.find((c) => c.storeName === storeName);
    if (!config) {
      console.warn(`No sync config found for store: ${storeName}`);
      return;
    }

    const shouldSync = await shouldSyncWithBackend(storeName);
    if (!shouldSync) return;

    try {
      console.log(`Syncing ${storeName} with backend...`);
      const items = await config.fetchFn();
      await config.syncFn(items);
      console.log(`${storeName} synced successfully`);
    } catch (error) {
      console.error(`Failed to sync ${storeName}:`, error);
    }
  }

  /**
   * Sync all registered stores with the backend
   */
  async syncAll() {
    if (!this.initialized) {
      console.warn("Sync service not initialized yet");
      return;
    }

    for (const config of this.syncConfigs) {
      await this.syncStore(config.storeName);
    }
  }

  /**
   * Handle store updated event
   */
  private handleStoreUpdated(event: CustomEvent) {
    const { storeName } = event.detail;
    this.syncStore(storeName);
  }
}

// Create a singleton instance
export const syncService = new SyncService();

/**
 * Hook to initialize the sync service
 */
export const useSyncService = () => {
  const queryClient = useQueryClient();

  // Initialize the sync service when the component mounts
  React.useEffect(() => {
    syncService.initialize(queryClient);

    // Set up periodic sync (every 5 minutes)
    const intervalId = setInterval(
      () => {
        syncService.syncAll();
      },
      5 * 60 * 1000,
    );

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [queryClient]);

  return syncService;
};
