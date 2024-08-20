import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
} from "@mui/material";
import { HeaderAPI } from "@/gec-tripetto";
import { useAuth } from "@/hooks/auth";
import { useMutation } from "@tanstack/react-query";
import { updateHeader } from "@/utils/apiCall";
import { useSetAtom } from "jotai";
import { alertAtom } from "@/stores/mainStore";
import manageError from "@/utils/manageError";

interface EnteteProps {
  header: HeaderAPI;
  onUpdated: () => void;
}

interface Inputs {
  societe: string;
  email: string;
  telephone: string;
  nom: string;
  prenom: string;
  opportunite: string;
  projet: string;
}

const Entete = ({ header, onUpdated }: EnteteProps) => {
  // Hook de gestion des autorisations
  const auth = useAuth();
  // Hook de gestion des alertes globales
  const setAlerte = useSetAtom(alertAtom);

  // Etat local des valeurs par défaut du formulaire
  const [defaultValues, setDefaultValues] = useState<Inputs>();
  // Etat local de modification des données
  const [disabled, setDisabled] = useState<boolean>(true);

  // Création du hook pour la gestion du formulaire
  const {
    handleSubmit,
    formState: { errors, isDirty },
    register,
    reset,
  } = useForm<Inputs>({
    defaultValues,
  });

  // Mise à jour des valeurs par défaut du formulaire lors du changement d'opportunité
  useEffect(() => {
    const values = {
      societe: header.societe,
      email: header.email,
      telephone: header.telephone,
      nom: header.nom,
      prenom: header.prenom,
      opportunite: header.opportunite,
      projet: header.projet,
    };
    setDefaultValues(values);
    reset(values);
  }, [header, reset]);

  // Mise à jour de l'entête de l'opportunité
  const { mutate } = useMutation({
    mutationFn: updateHeader,
    onSuccess: () => {
      setAlerte({
        severite: "success",
        message: "Mise à jour de l'opportunité effectuée.",
      });
      setDisabled(true);
      onUpdated();
    },
    onError: (error) => {
      setAlerte({ severite: "error", message: manageError(error) });
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutate({
      ...data,
      opportunite: data.opportunite.trim().toUpperCase(),
      projet: data.projet.trim().toUpperCase(),
      id: header.id,
      uuid: header.uuid,
    });
  };

  return (
    <Box
      component="form"
      id="detail-opportunite-form"
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Grid
        id="inputs"
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      >
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            required
            id="societe"
            className="header-input"
            label="raison sociale du client"
            disabled={disabled}
            {...register("societe", {
              required: "La RS est obligatoire",
              minLength: {
                value: 3,
                message: "La RS doit contenir au moins 3 caractères",
              },
              maxLength: {
                value: 155,
                message: "La RS ne peut contenir plus de 255 caractères.",
              },
            })}
            fullWidth
            error={errors.societe ? true : false}
            helperText={errors.societe?.message}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <TextField
            required
            id="email"
            className="header-input"
            label="email du contact"
            disabled={disabled}
            {...register("email", {
              required: "L'email est obligatoire",
              pattern: {
                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "L'adresse email est invalide",
              },
            })}
            fullWidth
            error={errors.email ? true : false}
            helperText={errors.email?.message}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <TextField
            id="nom"
            className="header-input"
            label="nom du contact"
            disabled={disabled}
            {...register("nom", {
              minLength: {
                value: 3,
                message: "La nom doit contenir au moins 3 caractères",
              },
              maxLength: {
                value: 255,
                message: "La nom ne peut contenir plus de 255 caractères.",
              },
            })}
            fullWidth
            error={errors.nom ? true : false}
            helperText={errors.nom?.message}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <TextField
            id="prenom"
            className="header-input"
            label="prenom du contact"
            disabled={disabled}
            {...register("prenom", {
              minLength: {
                value: 3,
                message: "Le prénom doit contenir au moins 3 caractères",
              },
              maxLength: {
                value: 255,
                message: "Le prénom ne peut contenir plus de 255 caractères.",
              },
            })}
            fullWidth
            error={errors.prenom ? true : false}
            helperText={errors.prenom?.message}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <TextField
            id="telephone"
            className="header-input"
            label="telephone du contact"
            disabled={disabled}
            {...register("telephone", {
              pattern: {
                value: /^(?:\+33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
                message: "Le numéro de téléphone est invalide",
              },
            })}
            fullWidth
            error={errors.telephone ? true : false}
            helperText={errors.telephone?.message}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <TextField
            id="opportunite"
            className="header-input"
            label="référence opportunité CRM"
            disabled={disabled}
            {...register("opportunite", {
              pattern: {
                value: /^OPP\d{7}$/i,
                message: "Référence incorrecte (ex: OPP1234567)",
              },
            })}
            fullWidth
            error={errors.opportunite ? true : false}
            helperText={errors.opportunite?.message}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <TextField
            id="projet"
            className="header-input"
            label="référence projet UBW"
            disabled={disabled}
            {...register("projet", {
              pattern: {
                value: /^P\d{6}$/i,
                message: "Référence incorrecte (ex: P123456)",
              },
            })}
            fullWidth
            error={errors.projet ? true : false}
            helperText={errors.projet?.message}
          />
        </Grid>
      </Grid>

      {auth.isUser && (
        <Box sx={{ textAlign: "end" }} id="form-control">
          <FormControlLabel
            control={
              <Switch
                id="modification"
                checked={!disabled}
                onChange={() => {
                  reset();
                  setDisabled(!disabled);
                }}
              />
            }
            label="Modifier"
          />
          <Button
            type="submit"
            variant="outlined"
            color="primary"
            disabled={disabled || !isDirty}
          >
            Enregistrer
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Entete;
