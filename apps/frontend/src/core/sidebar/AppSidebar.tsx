import { Link } from "@tanstack/react-router";
import { Grid2x2, Home, type LucideIcon, Sprout } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Username } from "@/core/authentication/Username";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shadcdn/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@/shadcdn/components/ui/sidebar";
import { useSwipe } from "@/shared/use-swipe.hook.ts";

interface NavigationItem {
  title: string;
  routeTo: string;
  icon?: LucideIcon;
  subItems?: NavigationItem[];
}

export const AppSidebar = () => {
  const { t } = useTranslation();

  const items: NavigationItem[] = [
    {
      title: t("navigation.home"),
      routeTo: "/",
      icon: Home,
    },
    {
      title: t("navigation.seeds"),
      routeTo: "/seeds",
      icon: Sprout,
      subItems: [
        {
          title: t("navigation.overview"),
          routeTo: "/seeds",
        },
        {
          title: t("navigation.add"),
          routeTo: "/seeds/-1",
        },
      ],
    },
    {
      title: t("navigation.beds"),
      routeTo: "/beds",
      icon: Grid2x2,
      subItems: [
        {
          title: t("navigation.overview"),
          routeTo: "/beds",
        },
        {
          title: t("navigation.add"),
          routeTo: "/beds/-1",
        },
      ],
    },
  ];
  const { toggleSidebar } = useSidebar();
  const swipeHandlers = useSwipe({
    onSwipedLeft: toggleSidebar,
    onSwipedRight: () => {},
  });

  return (
    <div {...swipeHandlers}>
      <Sidebar variant="sidebar" collapsible="icon">
        <SidebarContent className="bg-white dark:bg-black">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <Collapsible
                    key={item.title}
                    defaultOpen
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton asChild>
                          <Link
                            to={item.routeTo}
                            className="flex text-lg capitalize md:text-sm [&.active]:font-bold"
                          >
                            {item.icon && (
                              <item.icon className="text-lg md:text-sm" />
                            )}
                            <span className="text-lg md:text-sm">
                              {item.title}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      {item.subItems && (
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.subItems.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <Link
                                  to={subItem.routeTo}
                                  className="text-lg capitalize md:text-sm [&.active]:font-bold"
                                >
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      )}
                    </SidebarMenuItem>
                  </Collapsible>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="bg-white dark:bg-black">
          <div className="flex items-center">
            <Username />
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </div>
  );
};
