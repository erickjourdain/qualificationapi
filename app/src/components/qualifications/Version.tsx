import React, { useEffect, useState } from "react";
import { useSetAtom } from "jotai";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { sfAnd, sfEqual } from "spring-filter-query-builder";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import Typography from "@mui/material/Typography";
import { AnswersAPI, FormAPI, ProduitAPI } from "../../gec-tripetto";
import { getAnswers } from "../../utils/apiCall";
import manageError from "../../utils/manageError";
import { displayAlert } from "../../atomState";
import { DevisAPI } from "../../types/devisAPI";

interface VersionProps {
  formulaire: FormAPI;
  produit: ProduitAPI;
  maj: number;
  onChangeVer: (id: string) => void;
}

interface Version {
  id: number;
  value: number;
  courante: boolean;
  devis: DevisAPI | null;
}

const Version = ({ formulaire, produit, maj, onChangeVer }: VersionProps) => {

  // Chargement de l'état Atom de gestion des alertes
  const setAlerte = useSetAtom(displayAlert);

  // State: état du composant
  const [version, setVersion] = useState<string | null>(null);
  const [versions, setVersions] = useState<Version[]>([]);

  /*
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
  */

  // Récupération des différentes versions existantes des réponses au formulaire de qualification
  const { data: infiniteAnswers, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ["getVersionsInfinite", maj],
    queryFn: async ({ pageParam }) => {
      const filter = sfAnd([sfEqual("produit", produit.id), sfEqual("formulaire", formulaire.id)]);
      const answers = await getAnswers(filter.toString(), pageParam, ["id", "version", "courante", "devis"], 10);
      return answers.data as AnswersAPI;
    },
    initialPageParam: 1,
    getNextPageParam: (answers) => (answers.hasNext) ? answers.page + 1 : undefined,
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
      onChangeVer(courante.id.toString());
    }
    else setVersion(null);
  }, [versions]);
  // Mise à jour du tableau des versions suite récupération des données
  useEffect(() => {
    const ver: Version[] = [];
    infiniteAnswers?.pages.map(answers => answers.data.map(data => {
      ver.push({ id: data.id, value: data.version, courante: data.courante, devis: data.devis })
    }))
    setVersions(ver);
    if (hasNextPage) fetchNextPage();
  }, [infiniteAnswers])

  // Mise à jour de la version sélectionnée
  const handleChange = (_evt: React.MouseEvent<HTMLElement>, value: string | null) => {
    if (value) {
      setVersion(value);
      const selectedVersion = versions?.find(ver => ver.id === parseInt(value));
      onChangeVer(value);
    }
  }

  return (
    <>
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
    </>
  )
}

export default Version;
