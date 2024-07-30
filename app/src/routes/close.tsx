import { useEffect, useState } from 'react';
import { useSetAtom } from 'jotai';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { Box, Button, Container, CssBaseline, Typography } from '@mui/material';
import { alertAtom } from '@/stores/mainStore';
import { delAuthorisation, logout } from '@/utils/apiCall';
import manageError from '@/utils/manageError';

export const Route = createFileRoute('/close')({
  component: CloseApp,
})

function CloseApp () {

  const navigate = useNavigate();

  const [disconnect, setDisconnect] = useState<boolean>(false);

  // Chargement de l'état Atom des alertes et du token
  const setAlerte = useSetAtom(alertAtom);
  // const setToken = useSetAtom(tokenAtom);

  const { error, isError, isSuccess } = useQuery({
    queryKey: ["logout"],
    queryFn: logout,
    enabled: disconnect,
  })

  // fin du processus de déconnexion
  useEffect(() => {
    if (isSuccess) {
      delAuthorisation();
      // setToken(null);
      localStorage.removeItem("token");
      navigate({ to: "/login" });
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