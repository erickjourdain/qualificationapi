import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { sfAnd, sfEqual, sfLike, sfNotIn, sfOr } from "spring-filter-query-builder";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import { FormAPI, FormsAPI } from "../../gec-tripetto";
import { getForms } from "../../utils/apiCall";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";

interface FormulairesProps {
  formulaires: FormAPI[];
  onSelect: (formulaire: FormAPI | null) => void;
}

const SelectFormulaire = ({ formulaires, onSelect }: FormulairesProps) => {

  // State: formulaire sélectionné
  const [formulaire, setFormulaire] = useState<FormAPI | null>(null);
  // State: donnée de recherche
  const [inputValue, setInputValue] = useState<string>('');

  // Load Formulaires
  const { data: forms } = useQuery({
    queryKey: ["getFormulaires", inputValue, formulaires],
    queryFn: () => {
      const forms = formulaires.map(form => form.id);
      const filter = sfAnd([sfNotIn("id", forms), sfEqual("valide", "true"), sfOr([sfLike("titre", `*${inputValue}*`), sfLike("description", `*${inputValue}*`)])]);
      return getForms(filter.toString(), 1, ["id", "titre", "description", "formulaire"], 5);
    },
    select: (reponse) => reponse.data as FormsAPI,
  });

  // retour du formulaire sélectionné
  const handleConfirm = () => {
    onSelect(formulaire);
    setFormulaire(null);
  }

  return (
    <Stack direction="row" spacing={2} justifyContent="flex-end">
      <Autocomplete
        id="formulaire-search"
        sx={{ width: 300 }}
        size="small"
        autoComplete
        filterOptions={(x) => x}
        filterSelectedOptions
        includeInputInList
        value={formulaire}
        options={forms ? forms.data : []}
        getOptionLabel={(option) => option.titre}
        noOptionsText="Aucun formulaire"
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={(_event, newValue: FormAPI | null) => {
          setFormulaire(newValue);
        }}
        onInputChange={(_event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        renderInput={(params) => (
          <TextField {...params} label="Ajouter un formulaire" fullWidth />
        )}
        renderOption={(props, option) => {
          return (
            <li {...props}>
              <Box>
                <Box component="span"
                  sx={{ fontWeight: "bold" }}>
                  {option.titre}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {option.description}
                </Typography>
              </Box>
            </li>
          )
        }}
      />
      <Tooltip title="Lancer la qualification" placement="left">
      <IconButton color="primary" onClick={handleConfirm}>
        <CheckCircleIcon />
      </IconButton>
      </Tooltip>
    </Stack>

  )
}

export default SelectFormulaire;