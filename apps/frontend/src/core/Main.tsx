import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { MainLayout } from "@/core/layouts/main.layout.tsx";
import { AppSidebar } from "@/core/sidebar/AppSidebar.tsx";
import { ThemeProvider } from "@/core/theme/ThemeProvider.tsx";
import { ThemeToggle } from "@/core/theme/ThemeToggle.tsx";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/shadcdn/components/ui/sidebar.tsx";
import { Toaster } from "@/shadcdn/components/ui/toaster.tsx";

export const Main = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0,
        gcTime: 0, // Previously cacheTime
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        refetchOnReconnect: false,
        retry: false,
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
            <MainLayout>
              <SidebarTrigger className="absolute top-2 left-2" />
              <ThemeToggle className="absolute top-2 right-2" />
              <div className="pt-14 pb-4">
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
