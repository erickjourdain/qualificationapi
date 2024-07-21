import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { AuthContext } from "../auth";

interface RouterContext {
  auth: AuthContext
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" initialIsOpen={false} />
    </>
  ),
  notFoundComponent: () => {
    return <p>This is the notFoundComponent configured on root route</p>
  },
});
