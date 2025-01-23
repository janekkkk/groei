import { ReactNode } from "react";
import { useSeedsQuery } from "@/features/Seeds/useSeedQuery";

interface Props {
  children: ReactNode;
}

export const MainLayout = ({ children }: Props) => {
  useSeedsQuery();

  return (
    <div className="relative overflow-y-auto bg-white dark:bg-black">
      <div className="min-h-screen">
        <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </div>
  );
};
