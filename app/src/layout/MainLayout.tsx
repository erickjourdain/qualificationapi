import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router";
import { useSetAtom } from "jotai";
import { useQuery } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import { loggedUser } from "../atomState";
import { getCurrentUser } from "../utils/apiCall";
import ApplicationMainNav from "../components/ApplicationMainNav";
import GeneralLayout from "./GeneralLayout";

const MainLayout = () => {

  // Chargement de l'état Atom de l'utilisateur courant
  const setUser = useSetAtom(loggedUser);

  // Chargement de l'utilisateur connecté
  const {
    isLoading,
    data: userData,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["getCurrentUser"],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  // Enregistrement des données dans l'état Atom
  useEffect(() => {
    if (isSuccess) setUser(userData.data);
  }, [userData]);

  if (isError) return <Navigate to="/login" />

  if (isLoading) return (
    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
      <Typography variant="h5">Chargement en cours....</Typography>
    </Box>
  )

  return (
    <Box sx={{ display: "flex" }}>
      <ApplicationMainNav />
      <Box component="main" sx={{ flexGrow: 1, p: 3, maxWidth: "lg" }}>
        <Toolbar />
        <Outlet />
      </Box>
      <GeneralLayout />
    </Box>
  )
}

export default MainLayout;