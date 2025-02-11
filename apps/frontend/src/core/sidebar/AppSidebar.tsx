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
import { Home, LucideIcon, Sprout, Grid2x2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shadcdn/components/ui/collapsible";
import { Username } from "@/core/authentication/Username";
import { useSwipe } from "@/shared/use-swipe.hook.ts";
import { useTranslation } from "react-i18next";

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
                            className="flex text-lg md:text-sm [&.active]:font-bold capitalize"
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
                                  className="[&.active]:font-bold text-lg md:text-sm capitalize"
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
