import { useAtom, useAtomValue, useSetAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import Skeleton from "@mui/material/Skeleton";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { displayAlert, loggedUser } from "../atomState";
import { HeadersAPI } from "../types/headersAPI";
import { getHeaders } from "../utils/apiCall";
import manageError from "../utils/manageError";
import { isUser } from "../utils/auth";

const Headers = () => {

  const itemsPerPage = 5;
  const navigate = useNavigate();

  const user = useAtomValue(loggedUser);
  // Chargement de l'état Atom des alertes
  const setAlerte = useSetAtom(displayAlert);

  // State: page du tableau
  const [page, setPage] = useState<number>(0);

  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["getHeaders", page],
    queryFn: () => getHeaders(page + 1),
    select: (res) => res.data as HeadersAPI,
  });

  // gestion des erreurs de chargement des données
  useEffect(() => {
    if (isError) setAlerte({ severite: "error", message: manageError(error) });
  }, [isError]);

  // Gestion du changement de page du tableau de résultat
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
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

  if (!data || data.nbElements === 0) return (
    <Paper
      sx={{
        marginTop: "10px",
      }}
    >
      <Box px={3} py={2}>
        {
          user && user.role !== "USER" &&
          <Button color="primary" variant="contained" startIcon={<AddCircleIcon />} sx={{ mb: 2 }} onClick={() => navigate("/opportunite/new")}>
            Nouvelle Opportunité
          </Button>
        }
        <Alert severity="error">Aucune donnée disponible</Alert>
      </Box>
    </Paper>
  )

  return (
    <Paper
      sx={{
        marginTop: "10px",
      }}
    >
      <Box px={3} py={2}>
        <Typography variant="h5" gutterBottom>
          Opportunités
        </Typography>
        <Button color="primary" variant="contained" startIcon={<AddCircleIcon />} >
          Nouvelle Opportunité
        </Button>
      </Box>
    </Paper>
  )
}

export default Headers;