import React, { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import InputDevis from "./InputDevis";
import { AnswerAPI } from "../../gec-tripetto";
import { loggedUser } from "../../atomState";

interface DevisProps {
  answer: AnswerAPI | undefined;
  onChangeDevis: (devis: string) => void;
}

const Devis = ({ answer, onChangeDevis }: DevisProps) => {
  
  // Chargement de l'utilisateur connecté
  const user = useAtomValue(loggedUser);

  // Etat du composant
  const [devis, setDevis] = useState<string | null>(null);
  const [inputDevis, setInputDevis] = useState<boolean>(false);

  // Mise à jour du devis lors du changement de réponse
  useEffect(() => {
    setInputDevis(false);
    if (answer && answer.devis) {
      setDevis(answer.devis.reference);
    } else {
      setDevis(null);
    }
  }, [answer]);

  // Mise à jour de la référénce du devis
  const handleDevisChange = (dev: string) => {
    setDevis(dev);
    if (dev !== answer?.devis?.reference) onChangeDevis(dev);
    else setInputDevis(false);
  }

  if (!answer) return <></>

  if (devis && !inputDevis) return (
    <Chip label={devis} color="primary" onDoubleClick={() => {if (user?.role !== "READER") setInputDevis(true);} } />
  )

  if (inputDevis) return (
    <InputDevis initValue={devis} onSubmit={handleDevisChange} />
  )

  if (!devis && !inputDevis && user?.role !== "READER") return (
    <Button color="primary" variant="outlined" onClick={() => setInputDevis(true)}>
      Associer un devis
    </Button>
  )
}

export default Devis;