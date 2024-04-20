import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router";
import { useSetAtom } from "jotai";
import { useQuery } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import { loggedUser } from "../atomState";
import { getCurrentUser } from "../utils/apiCall";
import Settings from "./Settings";

const MainBox = () => {
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
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Qualification
          </Typography>
          <Settings />
        </Toolbar>
      </AppBar>
      <Outlet />
    </Box>
  )
}

export default MainBox;