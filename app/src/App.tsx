import { ThemeProvider, createTheme } from "@mui/material";
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";
import { setAuthorisation } from "./utils/apiCall";

// création d'un instance de QueryClient
const queryClient = new QueryClient({});

const defaultTheme = createTheme();

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
});

declare module '@tanstack/react-router' {
  interface Register {
    // This infers the type of our router and registers it across your entire project
    router: typeof router;
  }
}

function App() {
  // Chargement du token de connexion à l'API
  // récupération du token stocké dans le navigateur
  const token = localStorage.getItem("token");
  if (token) setAuthorisation(token);

  return (
    <ThemeProvider theme={defaultTheme}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App
