import {
  SidebarProvider,
  SidebarTrigger,
} from "@/shadcdn/components/ui/sidebar";
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
          <main className="w-full ">
            <MainLayout>
              <SidebarTrigger className="absolute left-2 top-2" />
              <div className="mt-4">
                <Outlet />
              </div>
            </MainLayout>
          </main>
        </SidebarProvider>
      </ThemeProvider>

      <TanStackRouterDevtools />
    </>
  ),
});
