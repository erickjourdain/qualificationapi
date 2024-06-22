import React, { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import SelectStatut from "./SelectStatut";
import { formatDateTime } from "../../utils/format";
import { AnswerAPI } from "../../gec-tripetto";
import { loggedUser } from "../../atomState";

interface HeaderAnswerProps {
  answer: AnswerAPI;
  onStatutChange: (statut: string) => void;
}

const HeaderAnswer = ({ answer, onStatutChange }: HeaderAnswerProps) => {

  // Chargement de l'utilisateur connecté
  const user = useAtomValue(loggedUser);

  // State: état du composant
  const [courante, setCourante] = useState<boolean>(false);
  const [locked, setLocked] = useState<boolean>(false);
  const [input, setInput] = useState<boolean>(false);

  // Mise à jour de l'état lors du changement de réponse
  useEffect(() => {
    setCourante(answer.courante);
    if (answer.courante && user && user.role !== "READER")
      setLocked(answer.courante && !!answer.lock && answer.lock.utilisateur.id !== user?.id);
    else setLocked(true);
  }, [answer]);

  // Mise à jour de l'état de l'input des formulaires
  useEffect(() => {
    setInput(courante && !locked && (user !== null) && (user.role !== "READER"));
  }, [courante, locked]);

  return (
    <Box sx={{
      m: 1,
      "& .MuiFormControl-root": { width: "30%", mr: 1, mt: 1 },
      "& .MuiPaper-root": { mt: 0 }
    }}>
      <Box display="flex" flexDirection="row" alignContent="center" justifyContent="space-between">
        <Box>
          <Typography variant="caption" display="block">
            {`créé le ${formatDateTime(answer.createdAt)} par ${answer.createur.nom} ${answer.createur.prenom}`}
          </Typography>
          <Typography variant="caption" display="block">
            {`modifié le ${formatDateTime(answer.updatedAt)} par ${answer.gestionnaire.nom} ${answer.gestionnaire.prenom}`}
          </Typography>
        </Box>
        {
          !courante &&
            <Alert color="info">La version n'est pas la version courante</Alert>

        }
        {
          courante && locked && answer.lock &&
            <Alert color="warning">La réponse est vérouillée par {answer.lock.utilisateur.prenom} {answer.lock.utilisateur.nom}</Alert>
        }<SelectStatut answer={answer} onSelect={onStatutChange} disabled={!input} />
      </Box>
    </Box>
  )
}

export default HeaderAnswer;