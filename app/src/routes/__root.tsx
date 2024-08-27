import React, { Suspense } from "react";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { Box, Container, Toolbar } from "@mui/material";
import MainNav from "@components/MainNav";
import NotFound from "@/components/NotFound";
import Alerte from "@components/Alerte";
import { AppRouterContext } from "@/gec-tripetto";

const TanStackRouterDevtools =
  import.meta.env.MODE === "production"
    ? () => null
    : React.lazy(() =>
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
        })),
      );

export const Route = createRootRouteWithContext<AppRouterContext>()({
  component: rootComponent,
  notFoundComponent: NotFound,
});

function rootComponent() {
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <MainNav />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Outlet />
          </Container>
          <Alerte />
        </Box>
      </Box>
      <Suspense>
        <TanStackRouterDevtools position="bottom-right" initialIsOpen={false} />
      </Suspense>
    </>
  );
}
