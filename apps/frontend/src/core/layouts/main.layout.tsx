import type { ReactNode } from "react";
import { useBedsQuery } from "@/features/Beds/useBedQuery";
import { useSeedsQuery } from "@/features/Seeds/useSeedQuery";
import { useSidebar } from "@/shadcdn/components/ui/sidebar.tsx";
import { useSwipe } from "@/shared/use-swipe.hook.ts";

interface Props {
  children: ReactNode;
}

export const MainLayout = ({ children }: Props) => {
  useSeedsQuery();
  useBedsQuery();

  const { toggleSidebar } = useSidebar();
  const swipeHandlers = useSwipe(
    {
      onSwipedLeft: () => {},
      onSwipedRight: toggleSidebar,
    },
    100,
    10, // Only swipe the left side of the screen to open the sidebar. (10% of screen width)
  );

  return (
    <div
      {...swipeHandlers}
      className="relative overflow-y-auto bg-white dark:bg-black"
    >
      <div className="min-h-screen">
        <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </div>
  );
};
