import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { findIndex } from "lodash";
import { useSetAtom } from "jotai";
import { Export, Instance } from "@tripetto/runner";
import { Box, Fab } from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PrintIcon from "@mui/icons-material/Print";
import { Route as RteOpp } from "@/routes/_auth/opportunites/$uuid";
import { useAuth } from "@/hooks/auth";
import { AnswerAPI } from "@/gec-tripetto";
import DisplayTripetto from "./DisplayTripetto";
import PlayTripetto from "@/components/PlayTripetto";
import { useMutation } from "@tanstack/react-query";
import { updateAnswer } from "@/utils/apiCall";
import { alertAtom } from "@/stores/mainStore";
import manageError from "@/utils/manageError";

const Reponse = () => {
  // Hook de navigation
  const navigate = useNavigate();
  // Hook de Gestion des autorisations
  const auth = useAuth();
  // Hook de récupération des données
  const data = RteOpp.useLoaderData();
  // Hook d'affichage des alertes
  const setAlerte = useSetAtom(alertAtom);
  // Etats local pour gestion de la réponse sélectionnée et affichage
  const [reponse, setReponse] = useState<AnswerAPI | null>(null);
  const [render, setRender] = useState<boolean>(false);
  // Etat local de lancement d'une nouvelle version
  const [start, setStart] = useState<boolean>(false);

  // Mise à jour de la réponse
  const { mutate } = useMutation({
    mutationKey: ["majReponse"],
    mutationFn: updateAnswer,
    onSuccess: ({ data: reponse }) => {
      setAlerte({
        severite: "success",
        message: "l'opportunité a été mise à jour",
      });
      navigate({
        search: (prev) => {
          return { ...prev, version: reponse.id };
        },
      });
    },
    onError: (error) => {
      setAlerte({ severite: "error", message: manageError(error) });
    },
  });

  // Récupération de la réponse à afficher
  useEffect(() => {
    setRender(false);
    // attente pour laisser le temps nécessaire à la mise à jour du composant de visualisation du formulaire
    setTimeout(() => {
      const index = findIndex(
        data.reponses,
        (rep) => rep.id === data.selection.version,
      );
      if (index >= 0) {
        setReponse(data.reponses[index]);
        setRender(true);
      }
    }, 250);
  }, [data.reponses, data.selection.version]);

  // Validation du formualire Tripetto
  const onSubmit = useCallback(
    (instance: Instance) => {
      setStart(false);
      const exportables = Export.exportables(instance);
      if (reponse)
        mutate({ id: reponse.id, reponse: JSON.stringify(exportables) });
      return true;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reponse],
  );

  return (
    <Box display="flex" flexDirection="column">
      <Box sx={{ alignSelf: "flex-end" }}>
        {data.selection.versionLocked && auth.isUser && (
          <Fab onClick={() => setStart(true)} color="warning" size="medium">
            <PlayCircleIcon />
          </Fab>
        )}
        <Fab
          onClick={() => console.log("lancement impression")}
          color="primary"
          sx={{ ml: 2 }}
          size="medium"
        >
          <PrintIcon />
        </Fab>
      </Box>
      <DisplayTripetto
        data={reponse ? JSON.parse(reponse.reponse) : ""}
        form={reponse ? JSON.parse(reponse.formulaire.formulaire) : ""}
        render={render}
      />
      <PlayTripetto
        open={start}
        onClose={() => setStart(false)}
        data={reponse ? JSON.parse(reponse.reponse) : ""}
        form={reponse ? JSON.parse(reponse.formulaire.formulaire) : ""}
        onSubmit={onSubmit}
      />
    </Box>
  );
};

export default Reponse;
