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
} from "@/shadcdn/components/ui/sidebar";
import { Home, LucideIcon, Sprout, Grid2x2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "@/core/Theme/ThemeToggle";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shadcdn/components/ui/collapsible";

interface NavigationItem {
  title: string;
  routeTo: string;
  icon?: LucideIcon;
  subItems?: NavigationItem[];
}

export const AppSidebar = () => {
  const items: NavigationItem[] = [
    {
      title: "Home",
      routeTo: "/",
      icon: Home,
    },
    {
      title: "Seeds",
      routeTo: "/seeds",
      icon: Sprout,
      subItems: [
        {
          title: "Overview",
          routeTo: "/seeds",
        },
        {
          title: "Add",
          routeTo: "/seeds/add",
        },
      ],
    },
    {
      title: "Beds",
      routeTo: "/beds",
      icon: Grid2x2,
      subItems: [
        {
          title: "Overview",
          routeTo: "/beds",
        },
        {
          title: "Add",
          routeTo: "/beds/add",
        },
      ],
    },
  ];

  return (
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
                          className="flex tex-sm [&.active]:font-bold"
                        >
                          {item.icon && <item.icon className="text-sm" />}
                          <span>{item.title}</span>
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
                                className="[&.active]:font-bold"
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
        <div className="flex justify-end items-center">
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
