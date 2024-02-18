import React from "react";
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useOutletContext, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import Skeleton from "@mui/material/Skeleton";
import { Form } from "gec-tripetto";
import { displayAlert } from "../atomState";
import { getForm } from "../utils/apiCall";
import manageError from "../utils/manageError";
import CardForm from "../components/CardForm";

type ContextType = {
  form: Form | null;
  setForm: React.Dispatch<React.SetStateAction<Form | null>>;
};

/**
 * Composant de base d'un formulaire
 *
 * @returns JSX
 */
const IndexForm = () => {
  // Chargement de l'état Atom des alertes
  const setAlerte = useSetAtom(displayAlert);

  const [form, setForm] = useState<Form | null>(null);

  const { slug } = useParams();
  const navigate = useNavigate();

  // query de récupération du formulaire
  const {
    isLoading,
    data: formData,
    isError,
    error,
  } = useQuery({
    queryKey: ["getForm", slug],
    queryFn: () => getForm(slug),
    refetchOnWindowFocus: false,
  });

  // mise à jour des données suite modification des données du formulaire
  useEffect(() => {
    if (formData)
      switch (formData.data.nombreFormulaires) {
        case 0:
          setAlerte({ severite: "warning", message: "Aucun formulaire trouvé" });
          break;
        case 1:
          setForm({
            ...formData.data.data[0],
            formulaire: JSON.parse(formData.data.data[0].formulaire),
          });
          break;
        default:
          setForm(null);
          break;
      }
    else setForm(null);
  }, [formData]);
  // gestion des erreurs de chargement des données
  useEffect(() => {
    if (isError) setAlerte({ severite: "error", message: manageError(error) });
  }, [isError]);

  // Affichage lors du chargement des données
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

  if (form)
    return (
      <div>
        <CardForm form={form} onAction={(statut: string) => navigate({ pathname: statut })} />
        {formData && <Outlet context={{ form, setForm } satisfies ContextType} />}
      </div>
    );
};

export default IndexForm;

export function useFormulaire() {
  return useOutletContext<ContextType>();
}
