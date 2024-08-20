import React, { SyntheticEvent, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { sfAnd, sfEqual } from "spring-filter-query-builder";
import Formulaires from "./Formulaires";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabQualif from "./TabQualif";
import { AnswerAPI, AnswersAPI, FormAPI, HeaderAPI, ProduitAPI } from "../../gec-tripetto";
import { getAnswers } from "../../utils/apiCall";
import { useAtomValue } from "jotai";
import { loggedUser } from "../../atomState";

interface QualificationsProps {
  header: HeaderAPI;
  produit: ProduitAPI | null;
  nbAffichage: number;
}

const Qualifications = ({ header, produit, nbAffichage }: QualificationsProps) => {

  const queryClient = useQueryClient();

  // Chargement utilisateur connecté
  const user = useAtomValue(loggedUser);
  // State: les formulaires utilisés
  const [formulaires, setFormulaires] = useState<FormAPI[]>([]);
  // State: formulaire sélectionné
  const [selectedTab, setSelectedTab] = useState<string>("");

  // Load les réponses aux formulaires de qualification pour le produit
  const { data: reponses, isLoading } = useQuery({
    queryKey: ["getAnwsersFromProduct", produit, nbAffichage],
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
    if (forms) {
      setFormulaires(forms);
      setSelectedTab(`${produit ? produit.id : "0"}-${forms[0] ? forms[0].id : 0}`);
    }
  }, [reponses]);

  useEffect(() => setSelectedTab(""), [produit]);

  // Changement de l'onglet sélectionné
  const handleTabChange = (_event: SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
  }

  const onUpdateFormulaire = () => {
    queryClient.invalidateQueries({ queryKey: ["getAnwsersFromProduct"] });
  }

  return (
    (produit && !isLoading && (selectedTab !== "") &&
      <Box>
        {
          (user && user.role !== "READER") &&
          <Formulaires 
            formulaires={formulaires} 
            produit={produit} 
            onUpdateFormulaire={onUpdateFormulaire} 
          />
        }
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={selectedTab} 
            onChange={handleTabChange} 
            aria-label="basic tabs example"
          >
            {
              formulaires.map((formulaire, index) => {
                return (
                  <Tab 
                    label={formulaire.titre} 
                    key={formulaire.id} 
                    id={`tab-${index}`}
                    value={`${produit.id}-${formulaire.id}`}
                  />
                )
              })
            }
          </Tabs>
        </Box>
        {
          formulaires.map((formulaire) => {
            return (
              <TabQualif
                show={`${produit.id}-${formulaire.id}` === selectedTab}
                header={header}
                formulaire={formulaire} 
                key={formulaire.id} 
                produit={produit} 
              />
            )
          })
        }
      </Box>
    )
  )
}

export default Qualifications;