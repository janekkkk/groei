import {
  SidebarProvider,
  SidebarTrigger,
} from "@/shadcdn/components/ui/sidebar";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { AppSidebar } from "@/core/sidebar/AppSidebar";
import { MainLayout } from "@/core/layouts/main.layout";
import { ThemeProvider } from "@/core/theme/ThemeProvider";
import { ThemeToggle } from "@/core/theme/ThemeToggle";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const Route = createRootRoute({
  component: () => {
    const queryClient = new QueryClient();

    return (
      <>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <SidebarProvider>
              <AppSidebar />
              <main className="w-full ">
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

          <ReactQueryDevtools initialIsOpen={false} />
          {/*<TanStackRouterDevtools />*/}
        </QueryClientProvider>
      </>
    );
  },
});
