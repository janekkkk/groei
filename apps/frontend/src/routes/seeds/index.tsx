import { createFileRoute } from "@tanstack/react-router";
import { SeedOverview } from "@/features/Seeds/SeedOverview";

export const Route = createFileRoute("/seeds/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <SeedOverview />
    </div>
  );
}
