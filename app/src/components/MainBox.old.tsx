import React from "react";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { loggedUser } from "../atomState";
import { getCurrentUser } from "../utils/apiCall";
import Menu from "./Menu";
import Sidebar from "./Sidebar";

const MainBox = () => {
  const drawerWidth: number = 240;

  // Chargement de l'état Atom de l'utilisateur courant
  const setUser = useSetAtom(loggedUser);
  // Création état local pour affichage du menu latéral
  const [showSidebar, setSidebar] = useState<boolean>(true);

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
      <CssBaseline />
      <Menu open={showSidebar} drawerwidth={drawerWidth} onToggleDrawer={() => setSidebar(!showSidebar)} />
      <Sidebar open={showSidebar} drawerwidth={drawerWidth} onToggleDrawer={() => setSidebar(!showSidebar)} />
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) => (theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[900]),
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  )
}

export default MainBox;