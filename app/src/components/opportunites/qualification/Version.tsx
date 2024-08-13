import { useEffect, useState } from "react";
import { filter, map } from "lodash";
import { useNavigate } from "@tanstack/react-router";
import { ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { Route as RteOpp } from "@/routes/_auth/opportunites/$uuid";
import { DevisAPI } from "@/gec-tripetto";

interface Version {
  id: number;
  value: number;
  courante: boolean;
  devis: DevisAPI | null;
}

const Version = () => {
  // Hook de navigation
  const navigate = useNavigate();
  // Hook de récupération des données
  const data = RteOpp.useLoaderData();

  // Etat local des versions des réponses au formulaires
  const [versions, setVersions] = useState<Version[]>([]);

  // Mise à jour des versions disponibles
  useEffect(() => {
    setVersions(
      map(
        filter(
          data.reponses,
          (rep) => rep.formulaire.id === data.selection.formulaire,
        ),
        (rep) => {
          return {
            id: rep.id,
            value: rep.version,
            courante: rep.courante,
            devis: rep.devis,
          };
        },
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.selection.formulaire, data.reponses]);

  // Changement de la version de la réponse sélectionnée
  const handleChange = (
    _evt: React.MouseEvent<HTMLElement>,
    value: number | null,
  ) => {
    // unlockVersion(data.selection);
    navigate({
      search: (prev) => {
        return {
          ...prev,
          version: value ? value : undefined,
        };
      },
    });
  };

  return (
    <>
      <Typography variant="overline">VERSION: </Typography>
      <ToggleButtonGroup
        sx={{ mr: 2 }}
        color="primary"
        value={data.selection.version}
        exclusive
        onChange={handleChange}
        size="small"
      >
        {versions?.map((ver) => (
          <ToggleButton value={ver.id} key={ver.id}>
            {ver.value}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </>
  );
};

export default Version;
