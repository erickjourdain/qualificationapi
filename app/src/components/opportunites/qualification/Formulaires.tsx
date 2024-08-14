import { useCallback, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { differenceBy } from "lodash";
import { useAtomValue, useSetAtom } from "jotai";
import { Export, Instance } from "@tripetto/runner";
import { Autocomplete, Box, Stack, TextField } from "@mui/material";
import { Route as RteOpp } from "@/routes/_auth/opportunites/$uuid";
import { FormAPI } from "@/gec-tripetto";
import { formsAtom } from "@/stores/mainStore";
import PlayTripetto from "@/components/PlayTripetto";
import { saveAnswer } from "@/utils/apiCall";
import { alertAtom } from "@/stores/mainStore";
import manageError from "@/utils/manageError";

interface FormulairesProps {
  formulaires: FormAPI[];
}

const Formulaires = ({ formulaires }: FormulairesProps) => {
  // Hook de navigation
  const navigate = useNavigate();
  // Hook liste des formulaires disponibles
  const existingForms = useAtomValue(formsAtom);
  // Hook d'affichage des alertes
  const setAlerte = useSetAtom(alertAtom);
  // Hook de récupération des données
  const data = RteOpp.useLoaderData();
  // Etat local des formulaires sélectionnables
  const [availableForms, setAvailableForms] = useState<FormAPI[]>([]);
  // Etat local du formulaire sélectionné
  const [selection, setSelection] = useState<FormAPI | null>(null);

  // Mise à jour de la réponse
  const { mutate } = useMutation({
    mutationKey: ["nouvelleReponse"],
    mutationFn: saveAnswer,
    onSuccess: ({ data: reponse }) => {
      setAlerte({
        severite: "success",
        message: "l'opportunité a été créée avec succès",
      });
      navigate({
        search: (prev) => {
          return { ...prev, formulaire: selection?.id, version: reponse.id };
        },
      });
    },
    onError: (error) => {
      setAlerte({ severite: "error", message: manageError(error) });
    },
  });

  // Définition des formulaires disponibles
  useEffect(() => {
    setAvailableForms(differenceBy(existingForms, formulaires, "id"));
  }, [existingForms, formulaires]);

  // Fermeture fenêtre formulaire sans enregistrement
  const handleClose = useCallback(() => {
    setSelection(null);
  }, []);

  // Enregistrement de la réponse
  const handleSubmit = useCallback(
    (instance: Instance) => {
      setSelection(null);
      // récupération des réponses fournies au questionnaire
      const exportables = Export.exportables(instance);
      mutate({
        reponse: JSON.stringify(exportables),
        produit: data.selection.produit,
        formulaire: selection?.id || 0,
      });
      return true;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data.selection, selection],
  );

  return (
    <Box>
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Autocomplete
          disablePortal
          id="form-selection"
          options={availableForms}
          getOptionLabel={(opt) => opt.titre}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          noOptionsText="Aucun formulaire trouvé"
          value={selection}
          onChange={(_event, newValue: FormAPI | null) => {
            setSelection(newValue);
          }}
          sx={{ width: 300 }}
          size="small"
          renderInput={(params) => (
            <TextField {...params} fullWidth label="Ajoutez un formulaire" />
          )}
        />
      </Stack>
      <PlayTripetto
        open={!!selection}
        form={selection ? JSON.parse(selection.formulaire) : ""}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    </Box>
  );
};

export default Formulaires;
