import React from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

interface QuitConfirmDialog {
  show: boolean;
  confirmQuit: (val: boolean) => void;
}

const QuitConfirmDialog = ({ show, confirmQuit }: QuitConfirmDialog) => {

  return (
    <Dialog open={show} onClose={() => confirmQuit(false)}>
      <DialogTitle>
        Poursuivre la navigation sans sauvegarder les données?
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Les données n'ont pas été sauvegardées. La poursuite de la navigation
          entrainera la perte des données renseignées.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => confirmQuit(true)}>Oui</Button>
        <Button onClick={() => confirmQuit(false)} autoFocus>
          Non
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default QuitConfirmDialog;