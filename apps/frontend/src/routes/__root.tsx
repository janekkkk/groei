import {
  SidebarProvider,
  SidebarTrigger,
} from "@/shadcdn/components/ui/sidebar";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { AppSidebar } from "@/core/sidebar/AppSidebar";
import { MainLayout } from "@/core/layouts/main.layout";
import { ThemeProvider } from "@/core/theme/ThemeProvider";
import { ThemeToggle } from "@/core/theme/ThemeToggle";

export const Route = createRootRoute({
  component: () => (
    <>
      <ThemeProvider>
        <SidebarProvider>
          <AppSidebar />
          <main className="w-full ">
            <MainLayout>
              <SidebarTrigger className="absolute left-2 top-2" />
              <ThemeToggle className="absolute right-2 top-2" />

              <div className="pt-14">
                <Outlet />
              </div>
            </MainLayout>
          </main>
        </SidebarProvider>
      </ThemeProvider>

      {/*<TanStackRouterDevtools />*/}
    </>
  ),
});
