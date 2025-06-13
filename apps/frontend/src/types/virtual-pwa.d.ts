/* eslint-disable @typescript-eslint/no-explicit-any */
// This file provides type declarations for the virtual modules created by the Vite PWA plugin

declare module "virtual:pwa-register/react" {
  import type { Ref } from "react";

  export interface RegisterSWOptions {
    immediate?: boolean;
    onNeedRefresh?: () => void;
    onOfflineReady?: () => void;
    onRegistered?: (
      registration: ServiceWorkerRegistration | undefined,
    ) => void;
    onRegisterError?: (error: any) => void;
  }

  export function useRegisterSW(options?: RegisterSWOptions): {
    needRefresh: [boolean, Ref<boolean>];
    offlineReady: [boolean, Ref<boolean>];
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>;
  };
}

// Also declare the non-React version
declare module "virtual:pwa-register" {
  export interface RegisterSWOptions {
    immediate?: boolean;
    onNeedRefresh?: () => void;
    onOfflineReady?: () => void;
    onRegistered?: (
      registration: ServiceWorkerRegistration | undefined,
    ) => void;
    onRegisterError?: (error: any) => void;
  }

  export function registerSW(options?: RegisterSWOptions): {
    needRefresh: boolean;
    offlineReady: boolean;
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>;
  };
}
