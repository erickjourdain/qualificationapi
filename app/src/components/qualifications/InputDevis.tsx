import React, { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface InputDevisProps {
  initValue: string | null;
  onSubmit: (devis: string) => void;
}

const InputDevis = ({ initValue, onSubmit }: InputDevisProps) => {

  // States du composant
  const [devis, setDevis] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (initValue) setDevis(initValue);
    else setDevis("");
  }, [initValue])

  // Gestion des clicks sur l'input du devis
  const onClickInput = () => {
    setError(false);
      // Test de l'entrée
      if (!/^DEV[0-9]{6}-V[1-9]$/.test(devis.trim())) {
        setError(true);
      } else onSubmit(devis.trim()); // Lancement de l'enregistrement
  }

  return (
    <FormControl variant="outlined">
      <InputLabel
        htmlFor="outlined-devis"
        size="small"
      >
        devis associé
      </InputLabel>
      <OutlinedInput
        id="outlined-devis"
        type="text"
        size="small"
        label="devis associé"
        value={devis}
        onChange={(evt) => setDevis(evt.target.value)}
        error={!!error}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              onClick={onClickInput}
              edge="end"
            >
              <CheckCircleIcon color="primary" />
            </IconButton>
          </InputAdornment>
        }
      />
      <FormHelperText error={!!error} id="outlined-devis-helper-text">
        DEV123456-V1
      </FormHelperText>
    </FormControl>
  )
}

export default InputDevis;