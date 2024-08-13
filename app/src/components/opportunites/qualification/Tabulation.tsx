import { SyntheticEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { FormAPI } from "@/gec-tripetto";
import { Alert, Box, Tab, Tabs } from "@mui/material";
import { Route as RteOpp } from "@/routes/_auth/opportunites/$uuid";

interface TabulationProps {
  formulaires: FormAPI[];
}

const Tabulation = ({ formulaires }: TabulationProps) => {
  // Hook de navigation
  const navigate = useNavigate();
  // Hook de récupération des données
  const data = RteOpp.useLoaderData();

  // Sélection du formulaire à afficher
  const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
    navigate({
      search: (prev) => {
        return { ...prev, formulaire: newValue, version: undefined };
      },
    });
  };

  if (formulaires.length === 0)
    return (
      <Alert severity="info">
        Sélectionner un formulaire pour démarrer la qualification.
      </Alert>
    );

  return (
    <Box>
      <Tabs
        value={data.selection.formulaire}
        onChange={handleTabChange}
        aria-label="formulaires-tabs"
      >
        {formulaires.map((form, index) => {
          return (
            <Tab
              label={form.titre}
              key={form.id}
              id={`tab-${index}`}
              value={form.id}
            />
          );
        })}
      </Tabs>
    </Box>
  );
};

export default Tabulation;
