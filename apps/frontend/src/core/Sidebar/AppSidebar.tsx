import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Home, LucideIcon, MoreHorizontal, Sprout } from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/core/Theme/ThemeToggle";

interface NavigationItem {
  title: string;
  routeTo: string;
  icon?: LucideIcon;
  subItems?: NavigationItem[];
}

export function AppSidebar() {
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
          title: "Add seeds",
          routeTo: "/seeds/add",
        },
      ],
    },
  ];

  return (
    <Sidebar variant="sidebar">
      <SidebarHeader>BladWijzer</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.routeTo} className="[&.active]:font-bold">
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.subItems && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuAction>
                          <MoreHorizontal className="absolute left-0 top-0" />
                        </SidebarMenuAction>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="right" align="start">
                        {item.subItems.map((subItem) => (
                          <DropdownMenuItem key={subItem.title}>
                            <Link to={subItem.routeTo}>
                              <span>{subItem.title}</span>
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <ThemeToggle />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
