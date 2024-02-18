import React from "react";
import { RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setAuthorisation } from "./utils/apiCall";
import { isAdmin, isCreator } from "./utils/auth";
import Layout from "./pages/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import IndexForm from "./pages/IndexForm";
import AddForm from "./pages/AddForm";
import Error from "./components/Error";
import EditForm from "./components/EditForm";
import PlayForm from "./components/PlayForm";
import ResultsForm from "./components/ResultsForm";
import NotAllowed from "./components/NotAllowed";
import IndexReponse from "./pages/IndexReponse";
import SignIn from "./pages/SignIn";
import Admin from "./pages/Admin";
import UserForm from "./pages/UserForm";
import CloseApp from "./pages/CloseApp";

// création d'un instance de QueryClient
const queryClient = new QueryClient({});

function App() {

  // Chargement du token de connexion à l'API
  // récupération du token stocké dans le navigateur
  const token = localStorage.getItem("token");
  if (token) setAuthorisation(token);

  // Création des routes de l'application
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Index />,
        },
        {
          path: "admin",
          children: [
            {
              index: true,
              element: isAdmin() ? <Admin /> : <NotAllowed />,
            },
            {
              path: "user/:slug",
              element: isAdmin() ? <UserForm /> : <NotAllowed />,
            }
          ]
        },
        {
          path: "ajouter",
          element: <AddForm />,
          errorElement: <Error />,
        },
        {
          path: "formulaire/:slug",
          element: <IndexForm />,
          children: [
            {
              path: "edit",
              element: isCreator() ? <EditForm /> : <NotAllowed />,
            },
            {
              path: "play",
              element: <PlayForm open />,
            },
            {
              path: "answers",
              element: <ResultsForm />,
            },
            {
              path: "answers/:uuid/:version",
              element: <IndexReponse />,
            },
          ],
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signin",
      element: <SignIn />,
    },
    {
      path: "/close",
      element: <CloseApp />
    }
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
