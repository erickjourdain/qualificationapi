import React from "react";
import { useSetAtom } from "jotai";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { createUser } from "../utils/apiCall";
import manageError from "../utils/manageError";
import { displayAlert } from "../atomState";

interface UserForm {
  nom: string;
  prenom: string;
  login: string;
  password: string;
  confirmPassword: string;
}

const AddUser = () => {
  const navigate = useNavigate();

  // Chargement de l'état Atom des alertes
  const setAlerte = useSetAtom(displayAlert);

  // Requête d'enregistrement
  const { mutate, isPending } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      setAlerte({ severite: "success", message: "L'utilisateur a été créé" });
      navigate(-1);
    },
    onError: (error) => {
      setError("root", { type: "serveur", message: manageError(error) });
    },
  });

  // hook gestion du formulaire
  const { formState: { errors }, handleSubmit, register, reset, setError } = useForm<UserForm>({
    defaultValues: {
      nom: "",
      prenom: "",
      login: "",
      password: "",
      confirmPassword: "",
    },
  })

  // soumission du formulaire
  const onSubmit = (data: UserForm) => {
    mutate({
      nom: data.nom,
      prenom: data.prenom,
      login: data.login,
      password: data.password
    })
  }

  return (
    <Paper>
      <Box component="form" 
        onSubmit={handleSubmit(onSubmit)} 
        onReset={() => reset()} 
        noValidate 
        sx={{ mt: 1 }}
        px={3} py={2}
      >
        <Typography variant="h6" sx={{ m: 2 }}>
          Création d'un nouvel utilisateur
        </Typography>
        <TextField
          required
          id="prenom"
          label="Prénom"
          fullWidth
          margin="dense"
          {...register("prenom", {
            required: "Le prenom est obligatoire.",
          })}
          error={errors.prenom ? true : false}
        />
        <Typography variant="inherit" color="error">
          {errors.prenom?.message}
        </Typography>
        <TextField
          required
          id="nom"
          label="Nom"
          fullWidth
          margin="dense"
          {...register("nom", {
            required: "Le nom est obligatoire.",
          })}
          error={errors.nom ? true : false}
        />
        <Typography variant="inherit" color="error">
          {errors.nom?.message}
        </Typography>
        <TextField
          required
          id="login"
          label="Login"
          fullWidth
          margin="dense"
          {...register("login", {
            required: "Le Login est obligatoire.",
            min: {
              value: 5,
              message: "Le login doit contenir au moins 5 caractères.",
            },
            max: {
              value: 25,
              message: "Le login ne peut contenir plus de 25 caractères.",
            },
            pattern: {
              value: /^[a-zA-Z]*$/g,
              message: "Le login ne peut contenir d'espace.",
            },
          })}
          error={errors.login ? true : false}
        />
        <Typography variant="inherit" color="error">
          {errors.login?.message}
        </Typography>
        <TextField
          required
          id="password"
          label="Mot de passe"
          fullWidth
          type="password"
          margin="dense"
          {...register("password", {
            min: {
              value: 5,
              message: "Le mot de passe doit contenir au moins 5 caractères.",
            },
            max: {
              value: 25,
              message: "Le mot de passe ne peut contenir plus de 25 caractères.",
            },
            pattern: {
              value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/g,
              message: "Le mot de passe doit contenir au moins un nombre, une minuscule, une majuscule et un caractère spécial.",
            },
          })}
          error={errors.password ? true : false}
        />
        <Typography variant="inherit" color="error">
          {errors.password?.message}
        </Typography>
        <TextField
          margin="normal"
          required
          fullWidth
          id="confirmPassword"
          label="confirmer le mot de passe"
          type="password"
          {...register("confirmPassword", {
            validate: {
              confirm: (value, values) => value === values.password || "Les mots de passe sont différents.",
            },
          })}
          error={errors.confirmPassword ? true : false}
        />
        <Typography variant="inherit" color="error">
          {errors.confirmPassword?.message}
        </Typography>
        <Typography variant="inherit" color="error">
          {errors.root?.message}
        </Typography>
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 3, mb: 2, mr: 2 }} disabled={isPending}>
          {!isPending ? "Enregistrer" : "Loading ..."}
        </Button>
        <Button type="reset" variant="contained" color="warning" sx={{ mt: 3, mb: 2 }} disabled={isPending}>
          Reset
        </Button>
      </Box>
    </Paper>
  )
}

export default AddUser;