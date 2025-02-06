import { ReactNode } from "react";
import { useSeedsQuery } from "@/features/Seeds/useSeedQuery";
import { useBedsQuery } from "@/features/Beds/useBedQuery";
import { useSwipe } from "@/shared/use-swipe.hook.ts";
import { useSidebar } from "@/shadcdn/components/ui/sidebar.tsx";

interface Props {
  children: ReactNode;
}

export const MainLayout = ({ children }: Props) => {
  useSeedsQuery();
  useBedsQuery();

  const { toggleSidebar } = useSidebar();
  const swipeHandlers = useSwipe({
    onSwipedLeft: () => {},
    onSwipedRight: toggleSidebar,
  });

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
