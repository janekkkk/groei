import { createLazyFileRoute } from "@tanstack/react-router";
import { BedOverview } from "@/features/Beds/BedOverview";

export const Route = createLazyFileRoute("/beds/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <BedOverview />
    </div>
  );
}
