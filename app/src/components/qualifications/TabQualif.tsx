import React, { useEffect, useState } from "react";
import { Export } from "@tripetto/runner";
import { Instance } from "@tripetto/runner/module";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtomValue, useSetAtom } from "jotai";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import Button from "@mui/material/Button";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { displayAlert, loggedUser } from "../../atomState";
import { AnswerAPI, FormAPI, ProduitAPI, Statut } from "../../gec-tripetto";
import manageError from "../../utils/manageError";
import { getAnswer, unlockAnswer, updateAnswer } from "../../utils/apiCall";
import PlayTripetto from "../PlayTripetto";
import VoirReponses from "./VoirReponses";
import Stack from "@mui/material/Stack";
import HeaderAnswer from "./HeaderAnswer";
import Version from "./Version";

interface TabQualifProps {
  show: boolean;
  formulaire: FormAPI;
  produit: ProduitAPI;
}

const TabQualif = ({ show, formulaire, produit }: TabQualifProps) => {

  // Chargement de l'utilisateur connecté
  const user = useAtomValue(loggedUser);
  // Chargement de l'état Atom de gestion des alertes
  const setAlerte = useSetAtom(displayAlert);

  // Hook de gestion des requêtes ver l'API
  const queryClient = useQueryClient();

  // State du composant
  const [version, setVersion] = useState<string | null>(null);
  const [oldVersion, setOldVersion] = useState<string | null>(null);
  const [showTripetto, setShowTripetto] = useState<boolean>(false);
  const [updatedAnswer, setUpdatedAnswer] = useState<Export.IExportables | null>(null);
  const [change, setChange] = useState<boolean>(false);

  // Chargement de la réponse à afficher
  const { data: answer } = useQuery({
    queryKey: ["getAnswer", version],
    queryFn: () => {
      const id = (version) ? parseInt(version) : null;
      if (id !== null) return getAnswer(id);
      else return null;
    },
    select: (reponse) => {
      if (reponse) return reponse.data as AnswerAPI;
    },
    enabled: !!version,
    throwOnError: (error, _query) => {
      setAlerte({ severite: "error", message: manageError(error) });
      return false;
    },
  });

  // Unlock previous answer
  const { refetch } = useQuery({
    queryKey: ["unlockAnswer", oldVersion, version],
    queryFn: () => {
      if (change && oldVersion) return unlockAnswer(parseInt(oldVersion));
      else return null;
    }
  })

  // Mise du vérouillage lors du changement de réponse
  useEffect(() => {
    if (answer && answer.courante && user) {
      const locked = (!!answer.lock && answer.lock.utilisateur.id !== user.id);
      setChange(!locked && user.role !== "READER");
    } else setChange(false);
  }, [answer]);

  useEffect(() => {
    return () => { refetch() };
  }, []);

  // Mise à jour de la réponse
  const { mutate, isPending } = useMutation({
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

  // Gestion changement version
  const handleVersionChange = (id: string) => {
    if (id !== answer?.id.toString())
      setOldVersion(answer?.id.toString() || null);
    setVersion(id);
  }

  return (
    <div
      role="tabpanel"
      hidden={!show}
      id={`tabpanel-${formulaire.id}`}
    >
      {show && (
        <Box>
          <Version formulaire={formulaire} produit={produit} onChange={handleVersionChange} />
          {answer &&
            <>
              <HeaderAnswer answer={answer} onDevisChange={onDevisChange} onStatutChange={onStatutChange} />
              <Box display="flex">
                {
                  !updatedAnswer && change &&
                  <Fab
                    onClick={() => setShowTripetto(true)}
                    color="warning"
                    size="medium"
                    sx={{ ml: "auto", order: 2 }}>
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
                  onSubmit={onSubmit}
                />
              </Box>
            </>
          }
          {
            updatedAnswer && <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="contained"
                color="primary"
                onClick={onReponseChange}
                disabled={isPending}
              >
                Enregistrer
              </Button>
              <Button
                variant="contained"
                color="warning"
                onClick={() => setUpdatedAnswer(null)}
                disabled={isPending}
              >
                Annuler
              </Button>
            </Stack>
          }
        </Box>
      )}
    </div>
  );
}


export default TabQualif;