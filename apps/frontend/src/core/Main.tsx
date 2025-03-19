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

export const Main = () => {
  const queryClient = new QueryClient();
  const isDev = import.meta.env.MODE === "development";

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SidebarProvider>
          <AppSidebar />
          <main className="w-full">
            <Toaster />
            <MainLayout>
              <SidebarTrigger className="absolute left-2 top-2" />
              <ThemeToggle className="absolute right-2 top-2" />
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
