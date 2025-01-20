import { createLazyFileRoute } from "@tanstack/react-router";
import { EditBeds } from "@/features/Beds/EditBeds";

export const Route = createLazyFileRoute("/beds/$bedId")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <EditBeds />
    </div>
  );
}
