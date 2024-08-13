import { useCallback, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { findIndex } from "lodash";
import { useSetAtom } from "jotai";
import { Alert, Box, MenuItem, TextField, Typography } from "@mui/material";
import { Route as RteOpp } from "@/routes/_auth/opportunites/$uuid";
import { formatDateTime } from "@/utils/format";
import { AnswerAPI, Statut } from "@/gec-tripetto";
import { useAuth } from "@/hooks/auth";
import { updateAnswer } from "@/utils/apiCall";
import { alertAtom } from "@/stores/mainStore";
import manageError from "@/utils/manageError";
import { Statuts } from "@/types/statuts";

const Info = () => {
  // Hook de Gestion des autorisations
  const auth = useAuth();
  // Hook de récupération des données
  const data = RteOpp.useLoaderData();
  // Hook d'affichage des alertes
  const setAlerte = useSetAtom(alertAtom);
  // Etats local pour la mise à jour du statut
  const [statut, setStatut] = useState<Statut>();
  const [reponse, setReponse] = useState<AnswerAPI | null>(null);

  // Récupération de la réponse à afficher
  useEffect(() => {
    const index = findIndex(
      data.reponses,
      (rep) => rep.id === data.selection.version,
    );
    if (index >= 0) {
      setReponse(data.reponses[index]);
      setStatut(data.reponses[index].statut);
    }
  }, [data.reponses, data.selection.version]);

  // Mise à jour de la réponse
  const { mutate } = useMutation({
    mutationKey: ["majReponse"],
    mutationFn: updateAnswer,
    onSuccess: () => {
      setAlerte({
        severite: "success",
        message: "l'opportunité a été mise à jour",
      });
    },
    onError: (error) => {
      setAlerte({ severite: "error", message: manageError(error) });
    },
  });

  // Changemenent du statut du devis
  const handleChange = useCallback(
    (statut: Statut) => {
      if (reponse) {
        setStatut(statut);
        mutate({ id: reponse.id, statut });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reponse],
  );

  return (
    <Box
      sx={{
        m: 1,
        "& .MuiFormControl-root": { width: "30%", mr: 1, mt: 1 },
        "& .MuiPaper-root": { mt: 0 },
      }}
    >
      <Box
        display="flex"
        flexDirection="row"
        alignContent="center"
        justifyContent="space-between"
      >
        <Box>
          <Typography variant="caption" display="block">
            {`créé le ${formatDateTime(reponse?.createdAt)} par ${reponse?.createur.nom} ${reponse?.createur.prenom}`}
          </Typography>
          <Typography variant="caption" display="block">
            {`modifié le ${formatDateTime(reponse?.updatedAt)} par ${reponse?.gestionnaire.nom} ${reponse?.gestionnaire.prenom}`}
          </Typography>
        </Box>
        {!reponse?.courante && (
          <Alert color="info">La version n'est pas la version courante</Alert>
        )}
        {reponse?.courante &&
          !data.selection.versionLocked &&
          reponse?.lock && (
            <Alert color="warning">
              La réponse est vérouillée par {reponse.lock.utilisateur.prenom}{" "}
              {reponse.lock.utilisateur.nom}
            </Alert>
          )}
        {reponse && (
          <TextField
            id="outlined-select-statut"
            select
            label="statut"
            size="small"
            value={statut}
            onChange={(event) => handleChange(event.target.value)}
            disabled={!auth.isUser || !data.selection.versionLocked}
          >
            {Statuts.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        )}
      </Box>
    </Box>
  );
};

export default Info;
