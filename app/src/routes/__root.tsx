import React, { Suspense } from "react";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { Alert, Box, Container, Toolbar } from "@mui/material";
import MainNav from "@components/MainNav";
import NotFound from "@/components/NotFound";
import { AppRouterContext } from "@/gec-tripetto";
import { envAtom, store } from "@/stores/mainStore";

const TanStackRouterDevtools =
  store.get(envAtom) === "production"
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

  const env = store.get(envAtom);

  const plateforme = () => {
    switch (env) {
      case "development" :
        return "Vous travaillez sur l'environnement de développement";
      case "test" :
        return "Vous travaillez sur l'environnement de test";
      case "production":
        return null;
    }
  }

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <MainNav />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Toolbar />
            <Container maxWidth="lg" sx={{ mt: 4 }}>
            {
              plateforme() && 
              <Alert severity="warning" variant="filled" sx={{mb: 2}}>
                {plateforme()}
              </Alert>
            } 
            <Outlet />
          </Container>
        </Box>
      </Box>
      <Suspense>
        <TanStackRouterDevtools position="bottom-right" initialIsOpen={false} />
      </Suspense>
    </>
  );
}
