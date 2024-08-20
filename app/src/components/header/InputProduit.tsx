import { FormEvent, useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import React from "react";

interface InputProduitProps {
  open: boolean;
  ajout: boolean;
  description: string;
  onSubmit: (description: string) => void;
  onClose: () => void;
}

const InputProduit = ({ open, ajout, description, onClose, onSubmit }: InputProduitProps) => {

  // Etat local du composant
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    setError(false);
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        component: 'form',
        onSubmit: (event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries((formData as FormData).entries());
          if (formJson.produit.toString().trim().length < 5) setError(true)
          else
            (description !== formJson.produit.toString().trim())
              ? onSubmit(formJson.produit.toString().trim())
              : onClose()
        },
      }}
    >
      <DialogTitle>
        {(ajout) ? "Ajouter un produit" : "Modifier le produit"}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          required
          margin="dense"
          id="produit"
          name="produit"
          defaultValue={description}
          label="nom du produit"
          fullWidth
          size="medium"
          error={error}
          helperText="Le produit doit contenir au moins 5 caractères"
        />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="warning" onClick={onClose}>
          Annuler
        </Button>
        <Button variant="contained" color="primary" type="submit">
          {(ajout) ? "Ajouter" : "Modifier"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default InputProduit;