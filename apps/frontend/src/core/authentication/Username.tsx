import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shadcdn/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/shadcdn/components/ui/sidebar";
import { ChevronsUpDown, LogIn, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shadcdn/components/ui/dropdown-menu";
import { useMount } from "react-use";
import { useState } from "react";
import { User } from "@groei/common/src/models/User";

export const Username = () => {
  const isLoggedIn = false;
  const { isMobile } = useSidebar();
  const [user, setUser] = useState<User>();
  const fakePersistedUser = {
    avatar: "https://github.com/shadcn.pn",
    email: "ikben@janekozga.nl",
    name: "Janek",
  };

  const login = () => {
    // ToDo
  };

  const logout = () => {
    // ToDo
  };

  useMount(async () => {
    const newUser = await fetch(
      `${import.meta.env.VITE_API_URI}/user/${fakePersistedUser.email}`,
    )
      .then((res) => res.json())
      .then((data) => data);
    setUser(newUser);
    console.log({ newUser });
  });

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user?.name}</span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user?.name}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            {/*<DropdownMenuSeparator />*/}
            {/*<DropdownMenuGroup>*/}
            {/*  <DropdownMenuItem>*/}
            {/*    <Sparkles />*/}
            {/*    Upgrade to Pro*/}
            {/*  </DropdownMenuItem>*/}
            {/*</DropdownMenuGroup>*/}
            {/*<DropdownMenuSeparator />*/}
            {/*<DropdownMenuGroup>*/}
            {/*  <DropdownMenuItem>*/}
            {/*    <BadgeCheck />*/}
            {/*    Account*/}
            {/*  </DropdownMenuItem>*/}
            {/*  <DropdownMenuItem>*/}
            {/*    <CreditCard />*/}
            {/*    Billing*/}
            {/*  </DropdownMenuItem>*/}
            {/*  <DropdownMenuItem>*/}
            {/*    <Bell />*/}
            {/*    Notifications*/}
            {/*  </DropdownMenuItem>*/}
            {/*</DropdownMenuGroup>*/}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              {isLoggedIn && (
                <button
                  type="button"
                  onClick={logout}
                  className="w-full flex gap-2 items-center "
                >
                  <LogOut />
                  Log out
                </button>
              )}
              {!isLoggedIn && (
                <button
                  type="button"
                  onClick={login}
                  className="w-full flex gap-2 items-center "
                >
                  <LogIn />
                  Log In
                </button>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
