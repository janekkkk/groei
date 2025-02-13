import { createFileRoute } from "@tanstack/react-router";
import { BedOverview } from "@/features/Beds/BedOverview";

export const Route = createFileRoute("/beds/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <BedOverview />
    </div>
  );
}
