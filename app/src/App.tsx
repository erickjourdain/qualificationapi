import React from "react";
import { RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, createTheme } from "@mui/material";
import MessageInfo from "./components/MessageInfo";
import { setAuthorisation } from "./utils/apiCall";
import { isAdmin, isLogged } from "./utils/auth";
import MainLayout from "./layout/MainLayout";
import Login from "./pages/Login";
import AddForm from "./pages/AddForm";
import NotAllowed from "./components/NotAllowed";
import SignIn from "./pages/SignIn";
import Admin from "./pages/Admin";
import UserForm from "./pages/UserForm";
import CloseApp from "./pages/CloseApp";
import ResetPwd from "./pages/ResetPwd";
import FormForm from "./pages/FormForm";
import AdminLayout from "./layout/AdminLayout";
import Headers from "./pages/Headers";
import AddHeader from "./pages/AddHeader";
import Header from "./pages/Header";

// création d'un instance de QueryClient
const queryClient = new QueryClient({});

const defaultTheme = createTheme();

function App() {

  // Chargement du token de connexion à l'API
  // récupération du token stocké dans le navigateur
  const token = localStorage.getItem("token");
  if (token) setAuthorisation(token);

  // Création des routes de l'application
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: isLogged() ? <Headers /> : <NotAllowed />,
        },
        {
          path: "opportunite/new",
          element: isLogged() ? <AddHeader /> : <NotAllowed />,
        },
        {
          path: "opportunite/:uuid",
          element: isLogged() ? <Header/> : <NotAllowed />
        }
      ]
    },
    {
      path: "admin",
      element: isAdmin() ? <AdminLayout /> : <NotAllowed />,
      children: [
        {
          index: true,
          element: <Admin />
        },
        {
          path: "user/:slug",
          element: <UserForm />,
        },
        {
          path: "form/:slug",
          element: <FormForm />,
        },
        {
          path: "form/ajouter",
          element: <AddForm />
        }
      ]
    },
    /*  {
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
},*/
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signin",
      element: <SignIn />,
    },
    {
      path: "/resetpwd",
      element: <ResetPwd />,
    },
    {
      path: "/close",
      element: <CloseApp />
    }
  ]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <MessageInfo />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
