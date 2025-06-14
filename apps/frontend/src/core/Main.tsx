import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/core/theme/ThemeProvider.tsx";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/shadcdn/components/ui/sidebar.tsx";
import { AppSidebar } from "@/core/sidebar/AppSidebar.tsx";
import { MainLayout } from "@/core/layouts/main.layout.tsx";
import { ThemeToggle } from "@/core/theme/ThemeToggle.tsx";
import { Outlet } from "@tanstack/react-router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Toaster } from "@/shadcdn/components/ui/toaster.tsx";
import { useSyncService } from "@/core/store/syncService";
import { ServiceWorkerUpdater } from "@/core/ServiceWorkerUpdater";

export const Main = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Set some sensible defaults for queries
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  });
  const isDev = import.meta.env.MODE === "development";

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SidebarProvider>
          <AppSidebar />
          <main className="w-full">
            <Toaster />
            {/* Add ServiceWorkerUpdater to handle app updates */}
            <ServiceWorkerUpdater />
            <MainLayout>
              <SidebarTrigger className="absolute left-2 top-2" />
              <ThemeToggle className="absolute right-2 top-2" />
              <div className="pt-14 pb-4">
                <SyncInitializer />
                <Outlet />
              </div>
            </MainLayout>
          </main>
        </SidebarProvider>
      </ThemeProvider>

      {isDev && (
        <>
          <ReactQueryDevtools />
          <TanStackRouterDevtools />
        </>
      )}
    </QueryClientProvider>
  );
};

// Component to initialize the sync service
const SyncInitializer = () => {
  // This hook initializes the sync service and sets up periodic sync
  useSyncService();

  // This component doesn't render anything
  return null;
};
