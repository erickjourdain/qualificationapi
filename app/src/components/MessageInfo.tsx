import React from "react";
import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { displayAlert } from "../atomState";


const MessageInfo = () => {
  // Chargement de l'état Atom des alertes
  const alerte = useAtomValue(displayAlert);
  
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (alerte) setOpen(true);
  }, [alerte]);

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return ( alerte &&
    <Snackbar open={open} autoHideDuration={5000} onClose={handleClose} anchorOrigin={{horizontal: "center", vertical: "top"}}>
      <Alert onClose={handleClose} severity={alerte.severite} sx={{ width: "100%" }} >
        {alerte.message}
      </Alert>
    </Snackbar>
  );
}

export default MessageInfo;
