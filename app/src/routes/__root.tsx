import { createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  notFoundComponent: () => {
    return <p>This is the notFoundComponent configured on root route</p>
  },
});
