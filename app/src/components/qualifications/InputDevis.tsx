import React, { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from '@mui/icons-material/Edit';
import { AnswerAPI } from "../../gec-tripetto";

interface InputDevisProps {
  answer: AnswerAPI;
  disabled: boolean;
  onSubmit: (devis: string) => void;
}

const InputDevis = ({ answer, disabled, onSubmit }: InputDevisProps) => {

  // States du composant
  const [editDevis, setEditDevis] = useState<boolean>(false);
  const [devis, setDevis] = useState<string>("");
  const [label, setLabel] = useState<string>("");
  const [helperText, setHelperText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Définition du texte d'aide et du label en fonction de l'état du composant
  useEffect(() => {
    (answer.devis) ? setDevis(answer.devis.toString()) : setDevis("");
    if (answer.devis === null && !editDevis) {
      setHelperText("cliquer sur le stylo pour associer un devis");
      setLabel("Aucun devis associé")
    }
    if (answer.devis || editDevis) setLabel("devis associé")
    if (editDevis) setHelperText("entrer le numéro de devis associé");
  }, [editDevis]);

  // Reset du composant suite mise à jour des données
  useEffect(() => {
    setDevis(answer?.devis?.toString() || "");
    setEditDevis(false);
    setError(null);
    (answer.devis) ? 
      setHelperText("cliquer sur le stylo pour modifier le devis") : 
      setHelperText("cliquer sur le stylo pour associer un devis");
  }, [answer]);

  // Gestion des clicks sur l'input du devis
  const onClickInput = () => {
    setError(null);
    if (editDevis) { // Input en mode édition
      // Test de l'entrée
      if (!/^2[0-9]{5}$/.test(devis.trim())) {
        setError("le numéro de devis est incorrect");
      } else onSubmit(devis.trim()); // Lancement de l'enregistrement
    } else { // Input en mode display
      setEditDevis(true);
    }
  }

  return (
    <FormControl variant="outlined">
      <InputLabel
        htmlFor="outlined-devis"
        size="small"
        disabled={!editDevis || disabled}
      >
        {label}
      </InputLabel>
      <OutlinedInput
        id="outlined-devis"
        type="text"
        size="small"
        label={label}
        disabled={!editDevis || disabled}
        value={devis}
        onChange={(evt) => setDevis(evt.target.value)}
        error={!!error}
        startAdornment={
          (editDevis || devis) && <InputAdornment position="start">DEV</InputAdornment>
        }
        endAdornment={!disabled &&
          <InputAdornment position="end">
            <IconButton
              onClick={onClickInput}
              edge="end"
            >
              {editDevis ? <CheckCircleIcon color="primary" /> : <EditIcon color="warning" />}
            </IconButton>
          </InputAdornment>
        }
      />
      <FormHelperText error={!!error} id="outlined-devis-helper-text">
        {(!!error) ? error : helperText}
      </FormHelperText>
    </FormControl>
  )
}

export default InputDevis;