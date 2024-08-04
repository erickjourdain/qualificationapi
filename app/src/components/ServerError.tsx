import { useCallback, useEffect, useState } from 'react';
import manageError from '@/utils/manageError';
import { Alert, Snackbar } from '@mui/material';

export default function ServerError({ error }: { error: Error }) {

  // Variable de gestion de l'ouverture du popup d'alerte
  const [open, setOpen] = useState<boolean>(false);

  // Ouverture du popup lors de la détection d'erreur
  useEffect(() => {if (!!error) setOpen(true)}, [error]);

  // Fermeture du popup
  const handleClose = useCallback((_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason !== "clickaway") {
      setOpen(false);
      return;
    }
  }, []);

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ horizontal: "center", vertical: "top" }}
    >
      <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }} >
        {manageError(error)}
      </Alert>
    </Snackbar>
  );
}