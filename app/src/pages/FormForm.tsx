import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useSetAtom } from "jotai";
import { useMutation, useQuery } from "@tanstack/react-query";
import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { displayAlert } from "../atomState";
import { getForm, updateForm } from "../utils/apiCall";
import { formatDateTime } from "../utils/format";
import { Form } from "../gec-tripetto";
import manageError from "../utils/manageError";
import FormInputs from "../components/FormInputs";
import PlayTripetto from "../components/PlayTripetto";

// définition du type pour la mise à jour des données
type UpdateFormValues = {
  id?: number;
  titre?: string;
  description?: string | null;
  formulaire?: string;
};

const FormForm = () => {
  const navigate = useNavigate();
  // Chargement de l'état Atom des alertes
  const setAlerte = useSetAtom(displayAlert);

  // Récupération des données de la route
  const { slug } = useParams();

  // Définition de l'état du composant pour gestion de la MAJ des données
  // du formulaire Tripetto
  const [updated, setUpdated] = useState<boolean>(false);
  const [formulaire, setFormulaire] = useState<string>("");
  const [dialog, setDialog] = useState(false);

  // Récupération du formulaire à mettre à jour
  const {
    data: form,
    error,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["getFormId", slug],
    queryFn: () => getForm(slug),
    select: (data) => {
      if (data.data.data.length) return data.data.data[0] as Form
      else return null;
    },
    refetchOnWindowFocus: false,
  });

  // Gestion des erreurs de chargement des données
  useEffect(() => {
    if (isError) setAlerte({ severite: "error", message: manageError(error) });
  }, [isError]);

  // définition de la requête de mise à jour du formulaire
  const { mutate } = useMutation({
    mutationFn: updateForm,
    onSuccess: (response) => {
      setAlerte({ severite: "success", message: "Les données ont été mises à jour" });
      if (form && form.slug !== response.data.slug) {
        navigate(`/formulaire/${response.data.slug}`);
      } else {
        refetch();
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
      }
    }
  };

  if (isLoading)
    return (
      <>
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
      </>
    );

  if (form === null) return (
    <Paper
      sx={{
        marginTop: "10px",
      }}
    >
      <Box px={3} py={2}>
        <Alert severity="error">Le formulaire recherché n'existe pas</Alert>
      </Box>
    </Paper>
  )

  if (form)
    return (
      <>
        <Paper
          sx={{
            marginTop: "10px",
          }}
        >
          <Box px={3} py={2}>
            <Typography variant="h6" sx={{ m: 2 }}>
              Formulaire <b>{form.titre}</b> Version {form.version} du {formatDateTime(form.updatedAt)}
            </Typography>
            <FormInputs
              form={{
                titre: form.titre,
                description: form.description,
                formulaire: JSON.stringify(form.formulaire),
              }}
              onSubmit={onSubmit}
              onFinish={() => navigate(-1)}
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
    )
}

export default FormForm;