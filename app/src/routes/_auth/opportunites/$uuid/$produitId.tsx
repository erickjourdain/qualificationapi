import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { sfAnd, sfEqual } from "spring-filter-query-builder";
import { getAnswers } from "@/utils/apiCall";
import { AnswersAPI } from "@/gec-tripetto";
import { Box, Paper, Tab, Tabs, Typography } from "@mui/material";
import { formAtom } from "@/stores/oppStore";
import { SyntheticEvent, useEffect } from "react";

export const Route = createFileRoute("/_auth/opportunites/$uuid/$produitId")({
  component: Produit,
  loader: async ({ context, params }) => {
    const { data: answers } = await context.queryClient.fetchQuery({
      queryKey: ["reponses", params.produitId],
      queryFn: () => {
        const filter = sfAnd([
          sfEqual("produit", params.produitId || 0),
          sfEqual("courante", "true"),
        ]).toString();
        const include = ["id", "formulaire"];
        return getAnswers(filter, 1, include);
      },
    });
    return answers as AnswersAPI;
  },
});

function Produit() {
  // Hook de récupération des données
  const data = Route.useLoaderData();

  // Hook de récupération des paramètres de la route
  const { uuid, produitId } = Route.useParams();

  // Hook de navigation
  const navigate = useNavigate();

  // Hook de gestion du formulaire sélection pour la visualisation des réponses
  const [form, setForm] = useAtom(formAtom);

  // Définition du formulaire sélectionné
  useEffect(() => {
    data && data.data.length ? setForm(data.data[0].formulaire) : setForm(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (form) navigate({ to: `/opportunites/${uuid}/${produitId}/${form.id}` });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  // Sélection du formulaire à afficher
  const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
    const ans = data.data.find((d) => d.formulaire.id === newValue);
    setForm(ans?.formulaire || null);
  };

  return (
    <Paper>
      <Box px={3} py={2}>
        {!form && (
          <Typography variant="h6" gutterBottom>
            Aucune qualification définie
          </Typography>
        )}
        {form && (
          <Box>
            <Tabs
              value={form?.id}
              onChange={handleTabChange}
              aria-label="formulaires-tabs"
            >
              {data.data.map((answer, index) => {
                return (
                  <Tab
                    label={answer.formulaire.titre}
                    key={answer.formulaire.id}
                    id={`tab-${index}`}
                    value={answer.formulaire.id}
                  />
                );
              })}
            </Tabs>
            <Outlet />
          </Box>
        )}
      </Box>
    </Paper>
  );
}
