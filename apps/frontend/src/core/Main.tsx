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
import { t } from "i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "@root/public/i18n/en.json";
import nl from "@root/public/i18n/nl.json";

export const Main = () => {
  const queryClient = new QueryClient();

  i18n.use(initReactI18next).init({
    resources: {
      en: en,
      nl: nl,
    },
    lng: "nl", // ToDo set up language detection
    fallbackLng: "nl",
    interpolation: {
      escapeValue: false,
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SidebarProvider>
          <AppSidebar />
          <main className="w-full ">
            <MainLayout>
              <h2>{t("Welcome to React")}</h2>
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
      <TanStackRouterDevtools />
    </QueryClientProvider>
  );
};
