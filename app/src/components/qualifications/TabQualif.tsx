import React, { useState } from "react";
import { Export } from "@tripetto/runner";
import { Instance } from "@tripetto/runner/module";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sfAnd, sfEqual } from "spring-filter-query-builder";
import { useSetAtom } from "jotai";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { displayAlert } from "../../atomState";
import { AnswersAPI, FormAPI, ProduitAPI, Statut } from "../../gec-tripetto";
import { formatDateTime } from "../../utils/format";
import manageError from "../../utils/manageError";
import { getAnswers, updateAnswer } from "../../utils/apiCall";
import PlayTripetto from "../PlayTripetto";
import InputDevis from "./InputDevis";
import SelectStatut from "./SelectStatut";
import VoirReponses from "./VoirReponses";
import Stack from "@mui/material/Stack";

interface TabQualifProps {
  show: boolean;
  formulaire: FormAPI;
  produit: ProduitAPI;
}

const TabQualif = ({ show, formulaire, produit }: TabQualifProps) => {

  // Chargement de l'état Atom de gestion des alertes
  const setAlerte = useSetAtom(displayAlert);

  // Hook de gestion des requêtes ver l'API
  const queryClient = useQueryClient();

  // State du composant
  const [showReponses, setShowReponses] = useState<boolean>(false);
  const [showTripetto, setShowTripetto] = useState<boolean>(false);
  const [updatedAnswer, setUpdatedAnswer] = useState<Export.IExportables | null>(null);

  // Chargement de la réponse à afficher
  const { data: answer, error } = useQuery({
    queryKey: ["getAnswer", show, produit, formulaire],
    queryFn: () => {
      const filter = sfAnd([sfEqual("produit", produit.id), sfEqual("courante", "true"), sfEqual("formulaire", formulaire.id)]);
      return getAnswers(filter.toString(), 1);
    },
    select: (reponse) => {
      const rep = reponse.data as AnswersAPI;
      if (rep.nbElements !== 1) {
        setAlerte({ severite: "error", message: "les données retournées sont incorrectes" });
        return undefined;
      }
      return rep.data[0];
    },
    throwOnError: (error, _query) => {
      setAlerte({ severite: "error", message: manageError(error) });
      return false;
    },
  });

  // Mise à jour de la réponse
  const { mutate } = useMutation({
    mutationFn: updateAnswer,
    onSuccess: () => {
      setAlerte({ severite: "success", message: "l'opportunité a été mise à jour" });
      queryClient.invalidateQueries({ queryKey: ["getAnswer"] })
    },
    onError: (error) => setAlerte({ severite: "error", message: manageError(error) }),
  })

  // Changement du numéro de devis associé
  const onDevisChange = (devis: string) => {
    if (answer) mutate({
      id: answer.id,
      devis,
    });
  }

  // Changemenent du statut du devis
  const onStatutChange = (statut: Statut) => {
    if (answer) mutate({
      id: answer.id,
      statut
    });
  }

  // Changement de la réponse
  const onReponseChange = () => {
    if (answer && updatedAnswer) mutate({
      id: answer.id,
      reponse: JSON.stringify(updatedAnswer),
    })
  }

  // Validation du formualire Tripetto
  const onSubmit = (instance: Instance) => {
    setShowTripetto(false);
    const exportables = Export.exportables(instance);
    setUpdatedAnswer(exportables);
    return true;
  }

  if (error) return <Alert severity="error">Impossible de lire la résponse sélectionnée</Alert>

  return (
    <div
      role="tabpanel"
      hidden={!show}
      id={`tabpanel-${formulaire.id}`}
    >
      {show && answer && (
        <Box>
          <Box sx={{
            p: 3,
            "& .MuiFormControl-root": { m: 1, width: "30%" },
            "& .MuiButton-root": { m: 1 }
          }}>
            <Typography variant="caption">
              {`créé le ${formatDateTime(answer.createdAt)} par ${answer.createur.nom} ${answer.createur.prenom}`}
              <br />
              {`modifié le ${formatDateTime(answer.updatedAt)} par ${answer.gestionnaire.nom} ${answer.gestionnaire.prenom}`}
            </Typography>
            <br />
            <Box display="flex" alignItems="flex-start">
              <InputDevis answer={answer} onSubmit={onDevisChange} />
              <SelectStatut answer={answer} onSelect={onStatutChange} />
            </Box>
          </Box>
          <Box display="flex">
            {
              !updatedAnswer && <Fab onClick={() => setShowTripetto(true)} color="warning" size="medium" sx={{ ml: "auto", order: 2 }}>
                <PlayCircleIcon />
              </Fab>
            }
            <VoirReponses answer={answer} updatedAnswer={updatedAnswer} />
            <PlayTripetto
              open={showTripetto}
              onClose={function (): void {
                setShowTripetto(false);
              }}
              form={JSON.parse(formulaire.formulaire)}
              data={JSON.parse(answer.reponse)}
              onSubmit={onSubmit
              }
            />
          </Box>
          {
            updatedAnswer && <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="contained" color="primary" onClick={onReponseChange}>Enregistrer</Button>
              <Button variant="contained" color="warning" onClick={() => setUpdatedAnswer(null)}>Annuler</Button>
            </Stack>
          }
        </Box>
      )}
    </div>
  );
}


export default TabQualif;