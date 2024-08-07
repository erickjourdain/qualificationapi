import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { useSetAtom, useAtomValue } from "jotai";
import { sfEqual } from "spring-filter-query-builder";
import {
  Alert,
  Box,
  Button,
  Paper,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { User } from "@/gec-tripetto";
import { displayAlert, loggedUser } from "@/atomState";
import { getResetPwdToken, getUsers } from "@/utils/apiCall";
import manageError from "@/utils/manageError";
import UtilisateurForm from "@components/admin/UtilisateurForm";

const Utilisateur = () => {
  // Chargement de l'état Atom des alertes
  const setAlerte = useSetAtom(displayAlert);
  // Chargement de l'état Atom des alertes
  const currentUser = useAtomValue(loggedUser);

  // Récupération des données de la route
  const { userSlug } = useParams({
    from: "/_mainLayout/_adminLayout/admin/utilisateurs/$userSlug",
  });

  // Définition des variables d'état du composant
  const [user, setUser] = useState<User | null>(null);
  const [pwdToken, setPwdToken] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [tokenCopy, setTokenCopy] = useState<boolean>(false);

  const {
    data: dataUser,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user", userSlug],
    queryFn: () => {
      const filter = `filter=${sfEqual("slug", userSlug ? userSlug : "")}`;
      return getUsers(filter, [], 1, 1);
    },
    refetchOnWindowFocus: false,
  });

  // Récupération du token de MAJ du mot de passe
  const { data: dataToken } = useQuery({
    queryKey: ["resetPwdToken"],
    queryFn: () => {
      if (user) return getResetPwdToken(user?.id);
      else return Promise.resolve(null);
    },
    enabled: pwdToken && !!user && token === null,
  });

  // Mise à jour des données suite récupération de l'utilisateur
  useEffect(() => {
    if (dataUser) {
      if (dataUser?.data.data.length !== 1)
        setAlerte({
          severite: "warning",
          message: "Erreur lors du chargement de l'utilisateur",
        });
      if (
        currentUser?.role === "ADMIN" ||
        dataUser?.data.data[0].id !== currentUser?.id
      ) {
        const us = dataUser?.data.data[0] as User;
        setUser(us);
        if (us.resetPwdToken !== null) {
          setToken(us.resetPwdToken || null);
          setPwdToken(true);
        }
      } else
        setAlerte({
          severite: "warning",
          message: "Vous ne disposez pas des droits pour accéder à cette page",
        });
    }
  }, [dataUser]);
  // Mise à jour du token
  useEffect(() => {
    if (dataToken) setToken(dataToken.data.token);
  }, [dataToken]);
  // Gestion des erreurs de chargement des données
  useEffect(() => {
    if (isError) setAlerte({ severite: "error", message: manageError(error) });
  }, [isError]);
  //
  useEffect(() => {
    setToken(null);
    setPwdToken(false);
    setTokenCopy(false);
  }, []);

  // Lancement de la mise à jour des données de l'utilisateur
  const handleUpdate = (newUser: User) => {
    setUser(newUser);
  };

  if (isLoading)
    return (
      <>
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
      </>
    );

  if (user)
    return (
      <Paper>
        <Box px={3} py={2}>
          <Typography variant="h6" sx={{ m: 2 }}>
            Profil {user.prenom} {user.nom}
          </Typography>
          <UtilisateurForm user={user} onUpdated={handleUpdate} />
          <Box sx={{ mt: 3 }}>
            {!token && (
              <Button onClick={() => setPwdToken(true)}>
                Changer mot de passe
              </Button>
            )}
            {token && !tokenCopy && (
              <>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(token);
                    setTokenCopy(true);
                  }}
                >
                  Copier Token
                </Button>
                <TextField
                  sx={{ mt: 1 }}
                  id="outlined-basic"
                  label={token}
                  variant="outlined"
                  disabled
                  fullWidth
                />
              </>
            )}
            {token && tokenCopy && (
              <Alert severity="success">
                Le token a été copié dans le presse papier
              </Alert>
            )}
          </Box>
        </Box>
      </Paper>
    );
};

export default Utilisateur;
