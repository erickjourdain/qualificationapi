import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useSetAtom, useAtomValue } from "jotai";
import { sfEqual } from "spring-filter-query-builder";
import Skeleton from "@mui/material/Skeleton";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { User } from "gec-tripetto";
import { displayAlert, loggedUser } from "../atomState";
import { getUsers } from "../utils/apiCall";
import manageError from "../utils/manageError";
import UpdateForm from "../components/users/UpdateForm";
import Button from "@mui/material/Button";

const UserForm = () => {
  const navigate = useNavigate();
  // Chargement de l'état Atom des alertes
  const setAlerte = useSetAtom(displayAlert);
  // Chargement de l'état Atom des alertes
  const currentUser = useAtomValue(loggedUser);

  // Récupération des données de la route
  const { slug } = useParams();

  // Définition des variables d'état du composant
  const [user, setUser] = useState<User | null>(null);
  const [saved, setSaved] = useState<boolean>(false);
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["user", slug],
    queryFn: () => {
      const filter = `filter=${sfEqual("slug", slug ? slug : "")}`;
      return getUsers(filter, [], 1, 1);
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data) {
      if (data?.data.data.length !== 1)
        setAlerte({ severite: "warning", message: "Erreur lors du chargement de l'utilisateur" });
      if (currentUser?.role === "ADMIN" || data?.data.data[0].id !== currentUser?.id) {
        const us = data?.data.data[0] as User;
        setUser(us);
      } else
        setAlerte({ severite: "warning", message: "Vous ne disposez pas des droits pour accéder à cette page" });
    }
  }, [data]);

  // gestion des erreurs de chargement des données
  useEffect(() => {
    if (isError) setAlerte({ severite: "error", message: manageError(error) } );
  }, [isError]);

  const handleUpdate = (newUser: User) => {
    setUser(newUser);
  }

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
      <Paper
        sx={{
          marginTop: "10px",
        }}
      >
        <Box px={3} py={2}>
          <Button onClick={() => navigate("/admin")}>Administration</Button>
          <Typography variant="h6" margin="dense">
            Profil {user.prenom} {user.nom}
          </Typography>
          <UpdateForm user={user} onUpdated={handleUpdate} />
        </Box>
      </Paper>
    );
};

export default UserForm;
