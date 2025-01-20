import { createLazyFileRoute } from "@tanstack/react-router";
import { EditSeeds } from "@/features/Seeds/EditSeeds";

export const Route = createLazyFileRoute("/seeds/$seedId")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <EditSeeds />
    </div>
  );
}
