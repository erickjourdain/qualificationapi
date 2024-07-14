import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSetAtom } from "jotai";
import { Box, IconButton, TextField } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import { useMutation } from "@tanstack/react-query";
import { createProduit } from "../../utils/apiCall";
import { displayAlert } from "../../atomState";
import manageError from "../../utils/manageError";

interface Inputs {
  id: number;
  description: string;
}

interface ProduitAddtProps {
  header: number;
  onClose: (update: boolean) => void;
}

const ProduitAdd = ({ header, onClose }: ProduitAddtProps) => {
  // Chargement de l'état Atom de gestion des alertes
  const setAlerte = useSetAtom(displayAlert);

  // Création du hook de gestion de la form
  const { formState: { errors }, handleSubmit, register, setValue, getValues } = useForm<Inputs>()

  // Enregistrement du produit
  const { mutate, isPending } = useMutation({
    mutationFn: (data: Inputs) => createProduit({ header, description: data.description }),
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
    <Box>
      <TextField
        sx={{ width: "80%" }}
        size="small"
        label="description du produit à ajouter"
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
    </Box>
  )
}

export default ProduitAdd