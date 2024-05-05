import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { sfAnd, sfEqual } from "spring-filter-query-builder";
import { AnswerAPI, AnswersAPI, FormAPI, ProduitAPI } from "../../gec-tripetto";
import { getAnswers } from "../../utils/apiCall";
import Formulaires from "./Formulaires";

interface QualificationsProps {
  produit: ProduitAPI|null;
}

const Qualifications = ({ produit }: QualificationsProps) => {

  // State: les formulaires utilisés
  const [formulaires, setFormulaires] = useState<FormAPI[]>([]);

  // Load les réponses aux formulaires de qualification pour le produit
  const { data: reponses, isLoading } = useQuery({
    queryKey: ["getAnwsersFromProduct", produit],
    queryFn: () => {
      const filer = sfAnd([sfEqual("produit", produit?.id || 0), sfEqual("courante", "true")]);
      return getAnswers(filer.toString());
    },
    enabled: !!produit,
    select: (reponse) => reponse.data as AnswersAPI, 
  })

  // 
  useEffect(() => {
    const forms = reponses?.data.map((reponse: AnswerAPI) => reponse.formulaire);
    if (forms) setFormulaires(forms);
  }, [reponses]);

  return (
    (produit && !isLoading && <Formulaires formulaires={formulaires} produit={produit} />)
  )
}

export default Qualifications;