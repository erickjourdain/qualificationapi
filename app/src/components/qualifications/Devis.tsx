import React, { useEffect, useState } from "react";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import InputDevis from "./InputDevis";
import { AnswerAPI } from "../../gec-tripetto";

interface DevisProps {
  answer: AnswerAPI | undefined;
  onChangeDevis: (devis: string) => void;
}

const Devis = ({ answer, onChangeDevis }: DevisProps) => {

  const [devis, setDevis] = useState<string | null>(null);
  const [inputDevis, setInputDevis] = useState<boolean>(false);

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
    <Chip label={devis} color="primary" onDoubleClick={() => setInputDevis(true)} />
  )

  if (inputDevis) return (
    <InputDevis initValue={devis} onSubmit={handleDevisChange} />
  )

  if (!devis && !inputDevis) return (
    <Button color="primary" variant="outlined" onClick={() => setInputDevis(true)}>
      Associer un devis
    </Button>
  )
}

export default Devis;