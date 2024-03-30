import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSetAtom } from "jotai";
import { Export, Instance } from "@tripetto/runner";
import { useMutation } from "@tanstack/react-query";
import { displayAlert } from "../atomState";
import { saveAnswer } from "../utils/apiCall";
import manageError from "../utils/manageError";
import { useFormulaire } from "../pages/IndexForm";
import PlayTripetto from "./PlayTripetto";

type PlayFormProps = {
  open: boolean;
}

const PlayForm = ({ open }: PlayFormProps) => {
  const navigate = useNavigate();
  // Chargement de l'état Atom des alertes
  const setAlerte = useSetAtom(displayAlert);

  // récupération du formulaire de qualification
  const { form } = useFormulaire();
  // State: boite de dialogue formulaire
  const [dialog, setDialog] = useState(false);

  useEffect(() => {
    setDialog(open)
  }, [open]);

  // fonction de traitement des données fournies en réponse au formulaire
  const onSubmit = (instance: Instance) => {
    // fermeture de la boite de dialogue
    setDialog(false);
    // récupération des réponses fournies au questionnaire
    const exportables = Export.exportables(instance);
    mutate({
      reponse: JSON.stringify(exportables),
      formulaire: form ? form.id : 0,
    });
    return true;
  };

  const { mutate } = useMutation({
    mutationFn: saveAnswer,
    onSuccess: () => {
      setAlerte({ severite: "success", message: "Les données ont été sauvegardées" });
      navigate({ pathname: "../answers" });
    },
    onError: (error: Error) => {
      setAlerte({ severite: "error", message: manageError(error) });
    },
  });

  if (form && form.formulaire)
    return <PlayTripetto open={dialog} onClose={() => navigate(-1)} form={form.formulaire} onSubmit={onSubmit} />
};

export default PlayForm;
