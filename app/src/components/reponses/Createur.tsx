import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { sfAnd, sfEqual } from "spring-filter-query-builder";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { displayAlert } from "../../atomState";
import { formatDateTime } from "../../utils/format";
import { getAnswers } from "../../utils/apiCall";
import manageError from "../../utils/manageError";

interface Value {
  prenom: string;
  nom: string;
  createdAt: string;
}

const Createur = () => {
  // Chargement de l'état Atom des alertes
  const setAlerte = useSetAtom(displayAlert);
  
  // récupération du paramètre de la page: identifiant de la série de réponses
  const { uuid } = useParams();

  const [value, setValue] = useState<Value | null>(null);

  // query récupération des versions existantes de la réponse
  const { data, error, isError, isLoading, isSuccess } = useQuery({
    queryKey: ["getAnswerCreateur", uuid],
    queryFn: () => {
      if (uuid === undefined) return Promise.resolve(null);
      const include = ["id", "version", "createur", "createdAt"];
      const filters = sfAnd([sfEqual("uuid", uuid), sfEqual("version", 1)]);
      return getAnswers(`filter=${filters}&include=${include.join(",")}&size=1`);
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data && isSuccess)
      setValue({
        prenom: data.data.data[0].createur.prenom,
        nom: data.data.data[0].createur.nom,
        createdAt: formatDateTime(data.data.data[0].createdAt),
      });
  }, [data]);
  // gestion des erreurs de chargement des données
  useEffect(() => {
    if (isError) setAlerte({ severite: "error", message: manageError(error) });
  }, [isError]);

  if (isLoading) return <Skeleton variant="text" sx={{ fontSize: "1rem" }} />;

  if (isSuccess && value)
    return (
      <Typography variant="h6" gutterBottom sx={{ pl: 3 }}>
        Qualification initiée le {value.createdAt} par {value.prenom} {value.nom}
      </Typography>
    );
};

export default Createur;
