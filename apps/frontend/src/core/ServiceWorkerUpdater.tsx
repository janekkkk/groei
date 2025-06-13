// Path: /Users/janekozga/Projects/Personal/groei/apps/frontend/src/core/ServiceWorkerUpdater.tsx
import { useEffect, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { Button } from "@/shadcdn/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shadcdn/components/ui/alert-dialog";
import { useTranslation } from "react-i18next";

/**
 * Component that handles service worker updates and prompts users
 * to reload when a new version of the app is available
 */
export function ServiceWorkerUpdater() {
  const { t } = useTranslation();
  const [showUpdateAlert, setShowUpdateAlert] = useState(false);

  // Register and watch for service worker updates
  const { updateServiceWorker } = useRegisterSW({
    onRegistered(registration) {
      // Check for updates every hour
      if (registration) {
        setInterval(
          () => {
            registration.update().catch(console.error);
          },
          60 * 60 * 1000,
        );
      }
    },
    onRegisterError(error) {
      console.error("SW registration error", error);
    },
    onNeedRefresh() {
      setShowUpdateAlert(true);
    },
  });

  // Clear IndexedDB cache when app version changes
  useEffect(() => {
    // Clear old caches on startup
    const clearOldCaches = async () => {
      try {
        if ("caches" in window) {
          const cacheNames = await window.caches.keys();
          const oldCacheNames = cacheNames.filter((name) =>
            name.includes("workbox-"),
          );
          await Promise.all(
            oldCacheNames.map((cacheName) => window.caches.delete(cacheName)),
          );
          console.log("Cleared old service worker caches");
        }
      } catch (error) {
        console.error("Failed to clear caches:", error);
      }
    };

    clearOldCaches();
  }, []);

  // Handle update confirmation
  const handleUpdate = () => {
    updateServiceWorker(true);
    setShowUpdateAlert(false);
  };

  return (
    <AlertDialog open={showUpdateAlert}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("app.updateAvailable")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("app.updateDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction asChild>
            <Button onClick={handleUpdate}>{t("app.updateNow")}</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
