import React, { useEffect, useState } from "react";
import { useSetAtom } from "jotai";
import { useQuery } from "@tanstack/react-query";
import { sfAnd, sfEqual } from "spring-filter-query-builder";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { AnswersAPI, FormAPI, ProduitAPI } from "../../gec-tripetto";
import { getAnswers } from "../../utils/apiCall";
import manageError from "../../utils/manageError";
import { displayAlert } from "../../atomState";

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

  // Récupération des différentes versions existantes des réponses au formulaire de qualification
  const { data: versions } = useQuery({
    queryKey: ["getVersions", maj],
    queryFn: () => {
      const filter = sfAnd([sfEqual("produit", produit.id), sfEqual("formulaire", formulaire.id)]);
      return getAnswers(filter.toString(), 1);
    },
    select: (reponse) => {
      const rep = reponse.data as AnswersAPI;
      return rep.data.map(r => { return { id: r.id, value: r.version, courante: r.courante } });
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
      onChange(value);
    }
  }

  return (
    <Box m={1}>
      <Typography variant="overline">VERSION: </Typography>
      <ToggleButtonGroup
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
    </Box>
  )
}

export default Version;
