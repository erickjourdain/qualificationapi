import { useMemo } from "react";
import Favicon from "react-favicon";
import { useAtomValue } from "jotai";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Alerte from "@components/Alerte";
import NotFound from "@components/NotFound";
import AppFavicon from "@components/mainnav/Favicon";
import { modeAtom } from "@/stores/mainStore";
import { routeTree } from "@/routeTree.gen";
import { AuthProvider, useAuth } from "@/hooks/auth";

// création d'un instance de QueryClient
const queryClient = new QueryClient({});

// création du router
export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultNotFoundComponent: NotFound,
  context: { queryClient, auth: undefined! },
});

declare module "@tanstack/react-router" {
  interface Register {
    // This infers the type of our router and registers it across your entire project
    router: typeof router;
  }
}

function InnerApp() {
  const auth = useAuth();
  return <RouterProvider router={router} context={{ queryClient, auth }} />;
}

function App() {
  // Hook d'authentification

  // Chargement de l'état Atom du theme
  const mode = useAtomValue(modeAtom);

  // Définition du thème
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode === "dark" ? "dark" : "light",
        },
      }),
    [mode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Favicon url={AppFavicon} />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <InnerApp />
        </AuthProvider>
        <Alerte />
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-left"
        />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
