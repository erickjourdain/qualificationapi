import React, { useState } from "react"; import Box from "@mui/material/Box";
import { useMutation } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { Export, Instance } from "@tripetto/runner";
import SelectFormulaire from "./SelectFormulaire";
import PlayTripetto from "../PlayTripetto"
import { FormAPI, ProduitAPI } from "../../gec-tripetto";
import { saveAnswer } from "../../utils/apiCall";
import { displayAlert } from "../../atomState";
import manageError from "../../utils/manageError";

interface FormulairesProps {
  formulaires: FormAPI[];
  produit: ProduitAPI;
}

const Formulaires = ({ formulaires, produit }: FormulairesProps) => {

  const setAlerte = useSetAtom(displayAlert);

  // State: formulaire sélectionné
  const [formulaire, setFormulaire] = useState<FormAPI | null>(null);
  // State: lancement formulaire
  const [open, setOpen] = useState<boolean>(false);

  // Enregistrement de la réponse 
  const { mutate } = useMutation({
    mutationKey: ["saveAnswer"],
    mutationFn: saveAnswer,
    onSuccess: () => setAlerte({ severite:"success", message: "réponse enregistrée" }),
    onError: (error) => setAlerte({ severite: "error", message: manageError(error) }),
  })

  // Lancement du formulaire
  const onFormulaireSelection = (form: FormAPI | null) => {
    setFormulaire(form);
    if (form) setOpen(true);
  }

  // Fermeture du formulaire
  const onCloseFormulaire = () => {
    setOpen(false);
    setFormulaire(null);
  }

  // Validation du formulaire
  const onSubmitFormulaire = (instance: Instance) => {
    setOpen(false);
    // récupération des réponses fournies au questionnaire
    const exportables = Export.exportables(instance);
    mutate({
      reponse: JSON.stringify(exportables),
      produit: produit.id,
      formulaire: formulaire ? formulaire.id : 0,
    });
    return true;
  }

  return (
    <Box>
      <SelectFormulaire formulaires={formulaires} onSelect={onFormulaireSelection} />
      {
        formulaire &&
        <PlayTripetto 
          open={open} 
          form={JSON.parse(formulaire.formulaire)} 
          onClose={onCloseFormulaire}
          onSubmit={onSubmitFormulaire} 
        />
      }
    </Box>
  )
}

export default Formulaires;