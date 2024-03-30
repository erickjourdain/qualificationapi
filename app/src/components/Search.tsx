import React from "react";
import { ChangeEvent } from "react";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import SyncIcon from "@mui/icons-material/Sync";

type SearcProps = {
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  loading: boolean;
};

const Search = ({onChange, loading}: SearcProps) => {
  return (
    <Input
      id="input-search"
      aria-label="Recherche formulaire"
      name="titre"
      startAdornment={<InputAdornment position="start">{loading ? <SyncIcon /> : <SearchIcon />}</InputAdornment>}
      placeholder="recherche"
      onChange={ onChange }
    />
  );
};

export default Search;
