import React, { ChangeEvent } from "react";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { sfLike, sfOr } from "spring-filter-query-builder";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Grid from "@mui/material/Grid";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import SyncIcon from "@mui/icons-material/Sync";
import { User } from "../gec-tripetto";
import { displayAlert } from "../atomState";
import { getUsers } from "../utils/apiCall";
import manageError from "../utils/manageError";

// définition du type pour les Props du composant
type SearchUserProps = {
  onUserChange: (user: User | null) => void;
  onSearchChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  loading: boolean;
};

/**
 * Composant de recherche d'un utilisateur
 * @returns JSX
 */
const SearchAnswers = ({ onUserChange, onSearchChange, loading }: SearchUserProps) => {
  const setAlerte = useSetAtom(displayAlert);

  const [value, setValue] = useState<User | null>(null);
  const [search, setSearch] = useState<string | null>(null);
  const [options, setOptions] = useState<readonly User[]>([]);

  // query de récupération des utilisateurs
  const { data, error, refetch, isError, isSuccess } = useQuery({
    queryKey: ["getUsers"],
    queryFn: () => {
      const filter = `filter=${sfOr([sfLike("nom", search ? search : ""), sfLike("prenom", search ? search : "")])}`;
      return getUsers(filter, ["id", "nom", "prenom"]);
    },
    enabled: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (search && !isEmpty(search)) refetch();
  }, [search]);

  useEffect(() => {
    const users = isSuccess && data ? data.data.data : [];
    setOptions(users);
  }, [data]);

  // gestion des erreurs de chargement des données
  useEffect(() => {
    if (isError) setAlerte({ severite: "error", message: manageError(error) });
  }, [isError]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Autocomplete
          id="search-user"
          sx={{ width: 300, paddingTop: "10px" }}
          filterOptions={(x) => x}
          options={options}
          autoComplete
          includeInputInList
          filterSelectedOptions
          value={value}
          noOptionsText="Aucun utilisateur"
          getOptionLabel={(option) => `${option.prenom} ${option.nom}`}
          onInputChange={(_event, newInputValue) => {
            setSearch(newInputValue);
          }}
          onChange={(_event: any, newValue: User | null) => {
            setValue(newValue);
            onUserChange(newValue);
          }}
          renderInput={(params) => <TextField {...params} label="Filtrer utilisateur" fullWidth />}
          renderOption={(props, option) => {
            if (isError) {
              return <Typography>Erreur chargement données</Typography>;
            } else
              return (
                <li {...props}>
                  <Typography variant="body2" color="text.secondary">
                    {option.prenom} {option.nom}
                  </Typography>
                </li>
              );
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Input
          sx={{ width: 300, paddingTop: "10px" }}
          id="input-search"
          aria-label="Recherche"
          name="recherche"
          startAdornment={<InputAdornment position="start">{loading ? <SyncIcon /> : <SearchIcon />}</InputAdornment>}
          placeholder="recherche"
          onChange={onSearchChange}
        />
      </Grid>
    </Grid>
  );
};

export default SearchAnswers;