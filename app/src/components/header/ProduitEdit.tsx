import React, { ReactEventHandler, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { Checkbox, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import { ProduitAPI } from "../../gec-tripetto";
import { displayAlert } from "../../atomState";
import manageError from "../../utils/manageError";
import { updateProduit } from "../../utils/apiCall";

interface Inputs {
  id: number;
  description: string;
}

interface ProduitEditProps {
  produit: ProduitAPI;
  selected: boolean;
  onClose: (update: boolean) => void;
}

const ProduitEdit = ({ produit, selected, onClose }: ProduitEditProps) => {

  // Chargement de l'état Atom de gestion des alertes
  const setAlerte = useSetAtom(displayAlert);

  // Création du hook de gestion de la form
  const { formState: { errors }, handleSubmit, register, setValue, getValues } = useForm<Inputs>()

  const labelId = `checkbox-produit-${produit.id}`;

  // Chargement des données lors de la mise à jour du produit
  useEffect(() => {
    setValue("id", produit.id);
    setValue("description", produit.description);
  }, [produit]);

  // Enregistrement du produit
  const { mutate, isPending } = useMutation({
    mutationFn: (data: Inputs) => updateProduit({ id: data.id, description: data.description }),
    onSuccess: () => {
      setAlerte({ severite: "success", message: "enregistrement du produit réalisé" });
      onClose(true);
    },
    onError: (error) => {
      setAlerte({ severite: "error", message: manageError(error) });
    }
  })

  // Validation de la description du produit
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutate(data);
  }

  return (
    <ListItem
      secondaryAction={
        <>
          <IconButton
            edge="end"
            aria-label="edit"
            color="primary"
            onClick={handleSubmit(onSubmit)}
            disabled={isPending}>
            <CheckCircleIcon />
          </IconButton>
          <IconButton
            edge="end"
            aria-label="edit"
            color="warning"
            onClick={() => onClose(false)}
            disabled={isPending}>
            <CloseIcon />
          </IconButton>
        </>
      }
      disablePadding
    >
      <ListItemButton
        selected={selected}>
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={selected}
            tabIndex={-1}
            disableRipple
            inputProps={{ 'aria-labelledby': labelId }}
          />
        </ListItemIcon>
        <ListItemText>
          <TextField
            sx={{ width: "80%" }}
            {
            ...register("description", {
              required: "La description du produit est obligatoire",
              minLength: {
                value: 10,
                message: "Le produit doit contenir au moins 10 caractères"
              },
              maxLength: {
                value: 255,
                message: "Le produit ne peut contenir plus de 255 caractères.",
              }
            })}
            error={errors.description ? true : false}
            helperText={errors.description?.message}
          />
        </ListItemText>
      </ListItemButton>
    </ListItem>
  )
}

export default ProduitEdit;