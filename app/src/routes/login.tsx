import { useState, useEffect, useCallback } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { useForm } from "react-hook-form";
import { Avatar, Box, Button, Container, CssBaseline, TextField, Typography } from '@mui/material';
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { delAuthorisation, login, setAuthorisation } from '@/utils/apiCall';
import manageError from '@/utils/manageError';
import { modeAtom, tokenAtom } from '@/stores/mainStore';

export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {

  const mode = useAtomValue(modeAtom);
  const setToken = useSetAtom(tokenAtom);
  const [color, setColor] = useState<string>("white");

  const navigate = useNavigate();

  // Définition des éléments pour la validation du formulaire
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm({
    defaultValues: {
      login: "",
      password: "",
    },
  });

  // Requête de login pour récupération du token de session
  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      // intégration du token dans le Header des futures requêtes
      setAuthorisation(response.data.token);
      // sauvegarde du token dans le navigateur
      setToken(response.data.token);
      navigate({ to: "/" });
    },
    onError: (error) => {
      setError("root", { type: "serveur", message: manageError(error) });
    },
  });

  // Appel de la requête de connexion à l'API
  const onSubmit = useCallback(async (data: { login: string, password: string }) => {
    //suppression du token existant et de l'entête des requêtes
    localStorage.removeItem("token");
    delAuthorisation()
    mutate({ login: data.login, password: data.password });
  }, []);

  // Mise à jour couleur du lien
  useEffect(() => {
    (mode === "light") ? setColor("#000000DE") : setColor("white");
  }, [mode]);

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
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1, width: "100%" }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="login"
            label="login"
            {...register("login", {
              required: "Le Login est obligatoire.",
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
            label="password"
            type="password"
            {...register("password", {
              required: "Le mot de passe est obligatoire.",
            })}
            error={errors.password ? true : false}
          />
          <Typography variant="inherit" color="error">
            {errors.password?.message}
          </Typography>
          <Typography variant="inherit" color="error">
            {errors.root?.message}
          </Typography>
          <Link to="/signin" style={{ color, textDecoration: "underligne" }} >Créer un compte</Link>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={isPending}>
            {!isPending ? "Login" : "Loading ..."}
          </Button>
          <Link to="/resetpwd" style={{ color, textDecoration: "underligne" }} >Mot de passe oublié</Link>
        </Box>
      </Box>
    </Container>
  );
}