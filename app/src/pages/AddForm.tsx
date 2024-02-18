import React from "react";
import { isEmpty } from "lodash";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { FormCreation } from "../gec-tripetto";
import { displayAlert } from "../atomState";
import { createForm } from "../utils/apiCall";
import manageError from "../utils/manageError";
import FormInputs from "../components/FormInputs";
import PlayTripetto from "../components/PlayTripetto";

/**
 *
 * @returns
 */
const AddForm = () => {
  const navigate = useNavigate();
  // Chargement de l'état Atom des alertes
  const setAlerte = useSetAtom(displayAlert);

  // définition de l'état du composant pour gestion de la MAJ des données
  // du formulaire Tripetto
  const [state, setState] = useState<string>("");
  const [dialog, setDialog] = useState(false);

  // définition de la requête de création du formulaire
  const { mutate } = useMutation({
    mutationFn: createForm,
    onSuccess: (response) => {
      setAlerte({ severite: "success", message: "Les données ont été sauvegardées" });
      navigate(`/formulaire/${response.data.slug}`);
    },
    onError: (error: Error) => {
      setAlerte({ severite: "error", message: manageError(error) });
    },
  });

  // Lancement de l'appel à la requête de mise à jour lors de la validation du formulaire
  const onSubmit = (data: { titre: string; description: string | null; formulaire: string }) => {
    const value: FormCreation = {
      titre: data.titre,
      description: data.description && !isEmpty(data.description.trim()) ? data.description.trim() : null,
      formulaire: data.formulaire
    };
    mutate(value);
  };

  return (
    <>
      <Paper>
        <Box px={3} py={2}>
          <Typography variant="h6" align="center" margin="dense">
            Création d'un nouveau formulaire de qualification
          </Typography>
          <FormInputs
            form={{
              titre: "",
              description: "",
              formulaire: "",
            }}
            onSubmit={onSubmit}
            onTestFormulaire={(val: string) => {
              setState(val);
              setDialog(true);
            }}
          />
        </Box>
      </Paper>
      {state.trim() !== "" &&
        <PlayTripetto
          open={dialog}
          onClose={() => setDialog(false)}
          form={JSON.parse(state)}
          onSubmit={() => {
            //setState({ ...state });
            setDialog(false);
            return true;
          }}
        />
      }
    </>
  );
};

export default AddForm;
