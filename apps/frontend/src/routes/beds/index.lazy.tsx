import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/beds/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello beds!</div>;
}
