import React from "react";
import { isEmpty } from "lodash";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useSetAtom } from "jotai";
import { useMutation } from "@tanstack/react-query";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { displayAlert } from "../atomState";
import { updateForm } from "../utils/apiCall";
import manageError from "../utils/manageError";
import { useFormulaire } from "../pages/IndexForm";
import PlayTripetto from "./PlayTripetto";
import FormInputs from "./FormInputs";

// définition du type pour la mise à jour des données
type UpdateFormValues = {
  id?: number;
  titre?: string;
  description?: string | null;
  formulaire?: string;
};

// définition du type pour la gestion de l'état local
type State = {
  updateFormulaire: boolean;
  formulaire: string;
};

//const EditForm = ({ onFinish }: EditFormProps) => {
const EditForm = () => {
  const navigate = useNavigate();
  // Chargement de l'état Atom des alertes
  const setAlerte = useSetAtom(displayAlert);

  // récupération du formulaire à mettre à jour via le contexte de la route
  const { form, setForm } = useFormulaire();

  // définition de l'état du composant pour gestion de la MAJ des données
  // du formulaire Tripetto
  const [updated, setUpdated] = useState<boolean>(false);
  const [formulaire, setFormulaire] = useState<string>("");
  const [dialog, setDialog] = useState(false);

  // définition de la requête de mise à jour du formulaire
  const { mutate } = useMutation({
    mutationFn: updateForm,
    onSuccess: (response) => {
      setAlerte({ severite: "success", message: "Les données ont été mises à jour" });
      if (form && form.slug !== response.data.slug) {
        navigate(`/formulaire/${response.data.slug}`);
      } else {
        setForm({
          ...response.data,
          formulaire: response.data ? JSON.parse(response.data.formulaire) : {},
        });
        navigate({ pathname: "../" });
      }
    },
    onError: (error: Error) => {
      setAlerte({ severite: "error", message: manageError(error) });
    },
  });

  // Lancement de l'appel à la requête de mise à jour lors de la validation du formulaire
  const onSubmit = (data: { titre: string; description: string | null; formulaire: string }) => {
    if (form) {
      // définition des champs à mettre à jour
      const value: UpdateFormValues = {};
      if (data.titre.trim() !== form.titre?.trim()) value.titre = data.titre;
      switch (data.description) {
        case undefined:
        case null:
          if (form.description !== null) value.description = null;
          break;
        default:
          const description = data.description.trim();
          if (description !== form.description?.trim()) {
            if (!isEmpty(description)) value.description = data.description;
            else value.description = null;
          }
          break;
      }
      if (updated) {
        value.formulaire = data.formulaire;
      }
      if (!isEmpty(value)) {
        value.id = form.id;
        mutate(value);
      } else {
        navigate({ pathname: "../" });
      }
    }
  };

  if (form)
    return (
      <>
        <Paper
          sx={{
            marginTop: "10px",
          }}
        >
          <Box px={3} py={2}>
            <FormInputs
              form={{
                titre: form.titre,
                description: form.description,
                formulaire: JSON.stringify(form.formulaire),
              }}
              onSubmit={onSubmit}
              onFinish={() => navigate({ pathname: "../" })}
              onUpdateFormulaire={(val: boolean) => {
                setUpdated(val);
              }}
              onTestFormulaire={(val: string) => {
                setFormulaire(val);
                setDialog(true);
              }}
            />
          </Box>
        </Paper>
        {formulaire.trim() !== "" &&
          <PlayTripetto
            open={dialog}
            onClose={() => setDialog(false)}
            form={JSON.parse(formulaire)}
            onSubmit={() => {
              setDialog(false);
              return true;
            }}
          />
        }
      </>
    );
};

export default EditForm;
