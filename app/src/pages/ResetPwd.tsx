import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import manageError from "../utils/manageError";
import { resetPassword } from "../utils/apiCall";

type Inputs = {
  password: string;
  confirmPassword: string;
  token: string;
};

const ResetPwd = () => {

  const [pwdChanged, setPwdChanged] = useState<boolean>(false);

  // Définition des éléments pour la validation du formulaire
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<Inputs>({
    defaultValues: {
      password: "",
      confirmPassword: "",
      token: "",
    },
  });

  // Requête d'enregistrement
  const { mutate, isPending } = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => setPwdChanged(true),
    onError: (error) => {
      setError("root", { type: "serveur", message: manageError(error) });
    },
  });

  const onSubmit = (data: Inputs) => {
    const { confirmPassword, ...payload } = data;
    mutate(payload);
  };

  if (pwdChanged) return (
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
        <Alert severity="success">Votre mot de passe a été modifié vous pouvez vous connected.</Alert>
        <Link to="/login">login</Link>
      </Box>
    </Container>
  )

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
      </Box>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
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
          id="token"
          label="token"
          {...register("token", {
            required: "Le token est obligatoire",
          })}
          error={errors.token ? true : false}
        />
        <Typography variant="inherit" color="error">
          {errors.token?.message}
        </Typography>
        <Typography variant="inherit" color="error">
          {errors.root?.message}
        </Typography>
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={isPending}>
          {!isPending ? "Enregistrer" : "Loading ..."}
        </Button>
      </Box>
    </Container>
  )
}

export default ResetPwd;