import React from "react";
import { Navigate, Outlet, useBlocker } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAtom, useSetAtom } from "jotai";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import { Typography } from "@mui/material";
import { changement, loggedUser } from "../atomState";
import { getCurrentUser } from "../utils/apiCall";
import Menu from "../components/Menu";
import Sidebar from "../components/Sidebar";
import MessageInfo from "../components/MessageInfo";
import QuitConfirmDialog from "../components/QuitConfirmDialog";

const drawerWidth: number = 240;
const defaultTheme = createTheme();

const MainBox = styled(Box, {})(() => ({
  "&": {
    display: "flex",
  }
}))

const Layout = () => {

  const setUser = useSetAtom(loggedUser);
  const [notSaved, setNotSaved] =  useAtom(changement);
  // Création état local pour affichage du menu latéral
  const [open, setOpen] = useState<boolean>(true);
  // Création état local pour affichage boite dialogue de confirmation de changement de page
  const [showQuitDialog, setQuitDialog] = useState<boolean>(false); 

  // Chargement de l'utilisateur courant
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

  let blocker = useBlocker(() => {
    if (notSaved) {
      setQuitDialog(true);
      return true;
    } else return false;
  })

  // Enregistrement des données utilisateurs dans le contexte de l'application
  useEffect(() => {
    if (isSuccess) {
      setUser(userData.data);
    }
  }, [userData]);

  // Gestion de la mise à jour de l'état d'affichage du menu latéral
  const handleToogleDrawer = () => {
    setOpen(!open);
  };  

/**
 * Confirmation de la navigation vers une autre page
 * @param val boolean - valeur retournée par la boite de dialogue de confirmation
 */
 const confirmNavigation = (val: boolean) => {
   setQuitDialog(false);
   if (val) {
     if (blocker.state === "blocked") {
      setNotSaved(false);
      blocker.proceed();
     }
   } else blocker.state === "unblocked";
 }

  // Erreur lors du chargement de l'utilisateur retour vers la page de login
  if (isError) return <Navigate to="/login" />;

  if (!isLoading)
    return (
      <ThemeProvider theme={defaultTheme}>
        <MainBox>
          <CssBaseline />
          <Menu open={open} drawerwidth={drawerWidth} onToggleDrawer={handleToogleDrawer} />
          <Sidebar open={open} drawerwidth={drawerWidth} onToggleDrawer={handleToogleDrawer} />
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
        </MainBox>
        <MessageInfo />
        <QuitConfirmDialog show={showQuitDialog} confirmQuit={confirmNavigation} />
      </ThemeProvider>
    );
  else return (
    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
      <Typography variant="h5">Chargement en cours....</Typography>
    </Box>
  );
};

export default Layout;
