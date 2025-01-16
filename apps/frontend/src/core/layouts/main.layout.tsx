import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export const MainLayout = ({ children }: Props) => {
  return (
    <div className="relative overflow-y-auto bg-white dark:bg-black">
      <div className="min-h-screen py-4">
        <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </div>
  );
};
