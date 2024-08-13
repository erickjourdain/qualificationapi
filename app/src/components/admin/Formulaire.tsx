import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { useSetAtom } from "jotai";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Alert, Box, Paper, Typography } from "@mui/material";
import PlayTripetto from "@components/PlayTripetto";
import FormulaireForm from "@components/admin/FormulaireForm";
import Loading from "@components/Loading";
import { getForm, updateForm } from "@/utils/apiCall";
import { formatDateTime } from "@/utils/format";
import { FormAPI } from "@/gec-tripetto";
import manageError from "@/utils/manageError";
import { alertAtom } from "@/stores/mainStore";

// définition du type pour la mise à jour des données
type UpdateFormValues = {
  id?: number;
  titre?: string;
  description?: string | null;
  formulaire?: string;
};

const Formulaire = () => {
  const navigate = useNavigate();

  // Chargement de l'état Atom des alertes
  const setAlerte = useSetAtom(alertAtom);

  // Récupération des données de la route
  const { formSlug } = useParams({
    from: "/_auth/_adminLayout/admin/formulaires/$formSlug",
  });

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
    queryKey: ["getFormId", formSlug],
    queryFn: () => getForm(formSlug),
    select: (data) => {
      if (data.data.data.length) return data.data.data[0] as FormAPI;
      else return null;
    },
    refetchOnWindowFocus: false,
  });

  // Gestion des erreurs de chargement des données
  useEffect(() => {
    if (isError) setAlerte({ severite: "error", message: manageError(error) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError]);

  // définition de la requête de mise à jour du formulaire
  const { mutate } = useMutation({
    mutationFn: updateForm,
    onSuccess: (response) => {
      setAlerte({
        severite: "success",
        message: "Les données ont été mises à jour",
      });
      if (form && form.slug !== response.data.slug) {
        navigate({ to: `/formulaire/${response.data.slug}` });
      } else {
        refetch();
      }
    },
    onError: (error: Error) => {
      setAlerte({ severite: "error", message: manageError(error) });
    },
  });

  // Lancement de l'appel à la requête de mise à jour lors de la validation du formulaire
  const onSubmit = (data: {
    titre: string;
    description: string | null;
    formulaire: string;
  }) => {
    if (form) {
      // définition des champs à mettre à jour
      const value: UpdateFormValues = {};
      if (data.titre.trim() !== form.titre?.trim()) value.titre = data.titre;
      switch (data.description) {
        case undefined:
        case null:
          if (form.description !== null) value.description = null;
          break;
        default: {
          const description = data.description.trim();
          if (description !== form.description?.trim()) {
            if (!isEmpty(description)) value.description = data.description;
            else value.description = null;
          }
          break;
        }
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

  if (isLoading) return <Loading />;

  if (form === null)
    return (
      <Paper
        sx={{
          marginTop: "10px",
        }}
      >
        <Box px={3} py={2}>
          <Alert severity="error">Le formulaire recherché n'existe pas</Alert>
        </Box>
      </Paper>
    );

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
              Formulaire <b>{form.titre}</b> Version {form.version} du{" "}
              {formatDateTime(form.updatedAt)}
            </Typography>
            <FormulaireForm
              form={{
                titre: form.titre,
                description: form.description,
                formulaire: form.formulaire,
              }}
              onSubmit={onSubmit}
              onFinish={() => navigate({ to: "/admin/formulaires" })}
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
        {formulaire.trim() !== "" && (
          <PlayTripetto
            open={dialog}
            onClose={() => setDialog(false)}
            form={JSON.parse(formulaire)}
            onSubmit={() => {
              setDialog(false);
              return true;
            }}
          />
        )}
      </>
    );
};

export default Formulaire;
