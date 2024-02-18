import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { createUser } from "../utils/apiCall";
import manageError from "../utils/manageError";

type Inputs = {
  prenom: string;
  nom: string;
  login: string;
  password: string;
  confirmPassword: string;
  secret: string;
};

const SignIn = () => {
  const [created, setCreated] = useState(false);

  // Définition des éléments pour la validation du formulaire
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<Inputs>({
    defaultValues: {
      prenom: "",
      nom: "",
      login: "",
      password: "",
      confirmPassword: "",
      secret: "",
    },
  });

  // Requête d'enregistrement
  const { mutate, isPending } = useMutation({
    mutationFn: createUser,
    onSuccess: () => setCreated(true),
    onError: (error) => {
      setError("root", { type: "serveur", message: manageError(error) });
    },
  });

  const onSubmit = (data: Inputs) => {
    const { confirmPassword, ...payload } = data;
    mutate(payload);
  };

  if (created)
    return (
      <Container component="main" maxWidth="md">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CssBaseline />
          <Alert severity="success">Votre compte est créé. Un administrateur va le valider.</Alert>
        </Box>
      </Container>
    );

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Enregistrement
        </Typography>
      </Box>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="prenom"
          label="prenom"
          {...register("prenom", {
            required: "Le prenom est obligatoire",
          })}
          error={errors.prenom ? true : false}
        />
        <Typography variant="inherit" color="error">
          {errors.prenom?.message}
        </Typography>
        <TextField
          margin="normal"
          required
          fullWidth
          id="nom"
          label="nom"
          {...register("nom", {
            required: "Le nom est obligatoire",
          })}
          error={errors.nom ? true : false}
        />
        <Typography variant="inherit" color="error">
          {errors.nom?.message}
        </Typography>
        <TextField
          margin="normal"
          required
          fullWidth
          id="login"
          label="login"
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
          margin="normal"
          required
          fullWidth
          id="password"
          label="mot de passe"
          type="password"
          {...register("password", {
            required: "Le mot de passe est obligatoire.",
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
        <TextField
          margin="normal"
          required
          fullWidth
          id="secret"
          label="clef d'enregistrement"
          {...register("secret", {
            required: "La clef est obligatoire.",
          })}
          error={errors.secret ? true : false}
        />
        <Typography variant="inherit" color="error">
          {errors.secret?.message}
        </Typography>
        <Typography variant="inherit" color="error">
          {errors.root?.message}
        </Typography>
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={isPending}>
          {!isPending ? "Enregistrer" : "Loading ..."}
        </Button>
      </Box>
    </Container>
  );
};

export default SignIn;
