import { useCallback, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { findIndex } from "lodash";
import { Button, Chip } from "@mui/material";
import { Route as RteOpp } from "@/routes/_auth/opportunites/$uuid";
import { useAuth } from "@/hooks/auth";
import { addDevisAnswer } from "@/utils/apiCall";
import InputDevis from "./InputDevis";
import { AnswerAPI } from "@/gec-tripetto";
import { alertAtom } from "@/stores/mainStore";
import manageError from "@/utils/manageError";

const Devis = () => {
  // Hook de Gestion des autorisations
  const auth = useAuth();
  // Hook de récupération des données
  const data = RteOpp.useLoaderData();
  // Hook d'affichage des alertes
  const setAlerte = useSetAtom(alertAtom);
  // Etats local pour la mise à jour du devis
  const [reponse, setReponse] = useState<AnswerAPI | null>(null);
  const [devis, setDevis] = useState<string | null>(null);
  const [inputDevis, setInputDevis] = useState<boolean>(false);

  // Récupération de la réponse à afficher
  useEffect(() => {
    const index = findIndex(
      data.reponses,
      (rep) => rep.id === data.selection.version,
    );
    if (index >= 0) {
      setReponse(data.reponses[index]);
      data.reponses[index].devis
        ? setDevis(data.reponses[index].devis.reference)
        : setDevis(null);
    }
  }, [data.reponses, data.selection.version]);

  // Mise à jour du devis
  const { mutate } = useMutation({
    mutationFn: addDevisAnswer,
    onSuccess: () => {
      setAlerte({
        severite: "success",
        message: "l'opportunité a été mise à jour",
      });
      setInputDevis(false);
    },
    onError: (error) => {
      setAlerte({ severite: "error", message: manageError(error) });
    },
  });

  // Mise à jour de la référénce du devis
  const handleDevisChange = useCallback(
    (dev: string) => {
      setDevis(dev);
      if (reponse && dev !== devis) mutate({ id: reponse.id, devis: dev });
      else setInputDevis(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [devis, reponse],
  );

  if (devis) return <Chip label={devis} color="primary" />;

  if (!inputDevis && devis === null && auth.isUser)
    return (
      <Button
        color="primary"
        variant="outlined"
        onClick={() => setInputDevis(true)}
      >
        Associer un devis
      </Button>
    );

  if (inputDevis && devis === null && auth.isUser)
    return <InputDevis initValue={devis} onSubmit={handleDevisChange} />;
};

export default Devis;
