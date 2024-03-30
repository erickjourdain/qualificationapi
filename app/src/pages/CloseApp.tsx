import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import { displayAlert, loggedUser } from "../atomState";
import { delAuthorisation, logout } from "../utils/apiCall";
import manageError from "../utils/manageError";

const CloseApp = () => {
  const navigate = useNavigate();

  const [disconnect, setDisconnect] = useState<boolean>(false);

  // Chargement de l'état Atom des alertes et de la sauvegarde des données
  const setAlerte = useSetAtom(displayAlert);
  const setUser = useSetAtom(loggedUser);

  const { error, isError, isSuccess } = useQuery({
    queryKey: ["logout"],
    queryFn: logout,
    enabled: disconnect,
  })

  // fin du processus de déconnexion
  useEffect(() => {
    if (isSuccess) {
      delAuthorisation();
      localStorage.removeItem("token");
      setUser(null);
      navigate("/login");
    }
  }, [isSuccess]);
  // gestion des erreurs de déconnexion
  useEffect(() => {
    if (isError) setAlerte({ severite: "error", message: manageError(error) });
  }, [isError]);

  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignContent: "center",
          justifyContent: "center",
          height: "75vh",
        }}
      >
        <Typography sx={{ mb: 3, textAlign: "center" }} variant="h5">
          Souhaitez-vous vous déconnecter de l'application?
        </Typography>
        <Button color="primary" variant="contained" onClick={() => setDisconnect(true)}>
          Me deconnecter.
        </Button>
      </Box>
    </Container>
  )
}

export default CloseApp;
