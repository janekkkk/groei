import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMount } from "react-use";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate();

  useMount(() => {
    navigate({ to: "/beds" });
  });

  return (
    <div>
      <h3>Welcome Home!</h3>
    </div>
  );
}
