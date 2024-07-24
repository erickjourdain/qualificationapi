import { useMemo } from "react";
import { useAtomValue } from "jotai";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routeTree } from "@/routeTree.gen";
import Alerte from "@components/Alerte";
import { modeAtom } from "@/stores/mainStore";

// création d'un instance de QueryClient
const queryClient = new QueryClient({});

// création du routerÒ
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  context: { queryClient },
});

declare module '@tanstack/react-router' {
  interface Register {
    // This infers the type of our router and registers it across your entire project
    router: typeof router;
  }
}

function App() {

  // Chargement de l'état Atom du theme
  const mode = useAtomValue(modeAtom);

  // Définition du thème
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: (mode === "dark") ? "dark" : "light",
        },
      }),
    [mode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Alerte />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
