import { createLazyFileRoute } from "@tanstack/react-router";
import { AddBeds } from "@/features/Beds/AddBeds";

export const Route = createLazyFileRoute("/beds/add")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <AddBeds />
    </div>
  );
}
