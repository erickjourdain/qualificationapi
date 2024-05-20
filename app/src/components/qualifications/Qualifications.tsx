import React, { SyntheticEvent, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { sfAnd, sfEqual } from "spring-filter-query-builder";
import Formulaires from "./Formulaires";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabQualif from "./TabQualif";
import { AnswerAPI, AnswersAPI, FormAPI, ProduitAPI } from "../../gec-tripetto";
import { getAnswers } from "../../utils/apiCall";
import { useAtomValue } from "jotai";
import { loggedUser } from "../../atomState";

interface QualificationsProps {
  produit: ProduitAPI | null;
}

const Qualifications = ({ produit }: QualificationsProps) => {

  const queryClient = useQueryClient();

  // Chargement utilisateur connecté
  const user = useAtomValue(loggedUser);
  // State: les formulaires utilisés
  const [formulaires, setFormulaires] = useState<FormAPI[]>([]);
  // State: formulaire sélectionné
  const [selectedTab, setSelectedTAb] = useState<number>(0);

  // Load les réponses aux formulaires de qualification pour le produit
  const { data: reponses, isLoading } = useQuery({
    queryKey: ["getAnwsersFromProduct", produit],
    queryFn: () => {
      const filter = sfAnd([sfEqual("produit", produit?.id || 0), sfEqual("courante", "true")]);
      return getAnswers(filter.toString(), 1, ["id", "formulaire"]);
    },
    enabled: !!produit,
    select: (reponse) => reponse.data as AnswersAPI,
  })

  // Mise à jour des formulaires suite à récupération des réponses
  useEffect(() => {
    const forms = reponses?.data.map((reponse: AnswerAPI) => reponse.formulaire);
    if (forms) setFormulaires(forms);
  }, [reponses]);

  // Changement de l'onglet sélectionné
  const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
    setSelectedTAb(newValue);
  }

  const onUpdateFormulaire = () => {
    queryClient.invalidateQueries({ queryKey: ["getAnwsersFromProduct"] });
  }

  return (
    (produit && !isLoading &&
      <Box>
        {
          (user && user.role !== "READER") &&
          <Formulaires formulaires={formulaires} produit={produit} onUpdateFormulaire={onUpdateFormulaire} />
        }
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={selectedTab} onChange={handleTabChange} aria-label="basic tabs example">
            {
              formulaires.map((formulaire, index) =>
                <Tab label={formulaire.titre} key={formulaire.id} id={`tab-${index}`} />
              )
            }
          </Tabs>
        </Box>
        {
          formulaires.map((formulaire, index) => <TabQualif show={selectedTab === index} formulaire={formulaire} key={formulaire.id} produit={produit} />)
        }
      </Box>
    )
  )
}

export default Qualifications;