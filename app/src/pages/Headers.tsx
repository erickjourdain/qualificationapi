import { useAtomValue, useSetAtom } from "jotai";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { sfLike, sfOr } from "spring-filter-query-builder";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { displayAlert, loggedUser } from "../atomState";
import { HeadersAPI } from "../types/headersAPI";
import { getHeaders } from "../utils/apiCall";
import manageError from "../utils/manageError";
import useDebounce from "../utils/debounce";
import Tableau from "../components/headers/Tableau";

const Headers = () => {

  const navigate = useNavigate();

  const user = useAtomValue(loggedUser);
  // Chargement de l'état Atom des alertes
  const setAlerte = useSetAtom(displayAlert);

  // State: page du tableau
  const [page, setPage] = useState<number>(0);
  // State: recherche
  const [search, setSearch] = useState<string>("");

  // Debounce de la requête de recherche
  const debouncedRequest = useDebounce(() => {
    if (page) setPage(0)
    else refetch();
  });

  // Requête de récupération des entêtes
  const { data, error, isError, isLoading, refetch } = useQuery({
    queryKey: ["getHeaders", page],
    queryFn: () => {
      const include = ["id", "uuid", "societe", "createur", "projet", "opportunite", "createdAt"];
      if (search.length) {
        const filter = sfOr([sfLike("projet", search), sfLike("opportunite", search), sfLike("societe", search)]);
        return getHeaders(page + 1, filter.toString(), include);
      }
      else return getHeaders(page + 1);
    },
    select: (res) => res.data as HeadersAPI,
  });

  // Gestion des erreurs de chargement des données
  useEffect(() => {
    if (isError) setAlerte({ severite: "error", message: manageError(error) });
  }, [isError]);

  // Gestion du changement de page du tableau de résultat
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Mise à jour du champ de recherche
  const onSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim();
    setSearch(value);
    debouncedRequest();
  }

  // Reset du champ de recherche
  const onClearSearch = () => {
    setSearch("");
    debouncedRequest();
  }

  // Affichage des données
  const Data = () => {
    if (data && data.nbElements === 0) return <Alert sx={{ m: 2 }} severity="error">Aucune donnée disponible</Alert>
    if (data && data.nbElements) return <Tableau headers={data} loading={isLoading} onPageChange={handleChangePage} />
  }

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
        <Box sx={{ display: "flex", justifyContent: "space-between" }} >
          {
            user && user.role !== "USER" &&
            <Button color="primary" variant="contained" startIcon={<AddCircleIcon />} sx={{ mb: 2 }} onClick={() => navigate("/opportunite/new")}>
              Nouvelle Opportunité
            </Button>
          }
          <TextField
            id="input-search"
            label="Recherche"
            value={search}
            onChange={onSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: search && (
                <IconButton onClick={onClearSearch}>
                  <ClearIcon />
                </IconButton>
              )
            }}
            variant="standard"
          />
        </Box>
        <Data />
      </Box>
    </Paper>
  )
}

export default Headers;