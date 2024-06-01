import React, { useEffect, useState } from "react";
import { useSetAtom } from "jotai";
import { useQuery } from "@tanstack/react-query";
import { sfAnd, sfEqual } from "spring-filter-query-builder";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import { AnswersAPI, FormAPI, ProduitAPI } from "../../gec-tripetto";
import { getAnswers } from "../../utils/apiCall";
import manageError from "../../utils/manageError";
import { displayAlert } from "../../atomState";
import { DevisAPI } from "../../types/devisAPI";
import InputDevis from "./InputDevis";

interface VersionProps {
  formulaire: FormAPI;
  produit: ProduitAPI;
  maj: number;
  onChange: (id: string) => void;
}

const Version = ({ formulaire, produit, maj, onChange }: VersionProps) => {

  // Chargement de l'état Atom de gestion des alertes
  const setAlerte = useSetAtom(displayAlert);

  // State: état du composant
  const [version, setVersion] = useState<string | null>(null);
  const [devis, setDevis] = useState<DevisAPI | null>(null);
  const [inputDevis, setInputDevis] = useState<boolean>(false);

  // Récupération des différentes versions existantes des réponses au formulaire de qualification
  const { data: versions } = useQuery({
    queryKey: ["getVersions", maj],
    queryFn: () => {
      const filter = sfAnd([sfEqual("produit", produit.id), sfEqual("formulaire", formulaire.id)]);
      return getAnswers(filter.toString(), 1);
    },
    select: (reponse) => {
      const rep = reponse.data as AnswersAPI;
      return rep.data.map(r => { return { id: r.id, value: r.version, courante: r.courante, devis: r.devis } });
    },
    throwOnError: (error, _query) => {
      setAlerte({ severite: "error", message: manageError(error) });
      return false;
    },
  });

  // Mise à jour de l'état des versions existantes
  useEffect(() => {
    const courante = versions?.find(ver => ver.courante);
    if (courante) {
      setVersion(courante.id.toString());
      onChange(courante.id.toString());
    }
    else setVersion(null);
  }, [versions]);

  // Mise à jour de la version sélectionnée
  const handleChange = (_evt: React.MouseEvent<HTMLElement>, value: string | null) => {
    if (value) {
      setVersion(value);
      const selectedVersion = versions?.find(ver => ver.id === parseInt(value));
      if (selectedVersion !== undefined) setDevis(selectedVersion.devis);
      onChange(value);
    }
  }

  const handleDevisChange = (dev: string) => {
    console.log(dev);
    console.log(dev.split("-")[0]);
    console.log(parseInt(dev.split("-")[1][1]));
    setDevis({id: 0, reference: dev.split("-")[0], version: parseInt(dev.split("-")[1][1])});
  }

  return (
    <Box m={1}>
      <Typography variant="overline">VERSION: </Typography>
      <ToggleButtonGroup
        sx={{ mr: 2 }}
        color="primary"
        value={version}
        exclusive
        onChange={handleChange}
        size="small">
        {
          versions?.map(ver =>
            <ToggleButton value={ver.id.toString()} key={ver.id}>
              {ver.value}
            </ToggleButton>)
        }
      </ToggleButtonGroup>
      {
        (devis) ?
          <Chip label={`${devis.reference}-V${devis.version}`} color="primary"/> : (
            (!inputDevis) ?
              <Button variant="contained" color="primary" onClick={() => setInputDevis(true)}>
                Associer un devis
              </Button> :
              <InputDevis onSubmit={handleDevisChange}/>
          )
      }
    </Box>
  )
}

export default Version;
