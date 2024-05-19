import React from "react";
import { AnswerAPI, Statut } from "../../gec-tripetto";
import { Statuts } from "../../types/statuts";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

interface SelectStatutProps {
  answer: AnswerAPI;
  onSelect: (statut: Statut) => void;
}

const SelectStatut = ({ answer, onSelect }: SelectStatutProps) => {

  return (
    <TextField
    id="outlined-select-statut"
    select
    label="statut"
    size="small"
    value={answer.statut}
    onChange={(event) => onSelect(event.target.value)}
    helperText="définir le statut"
  >
    {Statuts.map((option) => (
      <MenuItem key={option} value={option}>
        {option}
      </MenuItem>
    ))}
  </TextField>
  )
}

export default SelectStatut;