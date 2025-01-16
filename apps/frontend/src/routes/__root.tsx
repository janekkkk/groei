import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { AppSidebar } from "@/core/Sidebar/AppSidebar";
import { MainLayout } from "@/core/layouts/main.layout";
import { ThemeProvider } from "@/core/Theme/ThemeProvider";

export const Route = createRootRoute({
  component: () => (
    <>
      <ThemeProvider>
        <SidebarProvider>
          <AppSidebar />
          <main className="w-full">
            <SidebarTrigger />
            <MainLayout>
              <Outlet />
            </MainLayout>
          </main>
        </SidebarProvider>
      </ThemeProvider>

      <TanStackRouterDevtools />
    </>
  ),
});
