import { createRootRoute } from "@tanstack/react-router";
import { Main } from "@/core/Main.tsx";

export const Route = createRootRoute({
  component: () => {
    return <Main />;
  },
});
