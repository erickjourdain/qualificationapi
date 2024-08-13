import { useCallback } from "react";
import { find, findIndex, map, uniqBy } from "lodash";
import { z } from "zod";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { sfAnd, sfEqual } from "spring-filter-query-builder";
import { Box, Chip, Paper, Stack } from "@mui/material";
import ServerError from "@/components/ServerError";
import Entete from "@/components/opportunites/Entete";
import Produits from "@/components/opportunites/produits/Liste";
import Tabulation from "@/components/opportunites/qualification/Tabulation";
import Formulaires from "@/components/opportunites/qualification/Formulaires";
import Version from "@/components/opportunites/qualification/Version";
import Devis from "@/components/opportunites/qualification/Devis";
import unlockVersion from "@/utils/unlockVersion";
import { AnswerAPI, FormAPI, HeaderAPI, ProduitAPI } from "@/gec-tripetto";
import {
  getAnswers,
  getHeaders,
  getProduits,
  lockAnswer,
} from "@/utils/apiCall";
import Info from "@/components/opportunites/qualification/Info";
import Reponse from "@/components/opportunites/qualification/Reponse";

const formSearchSchema = z.object({
  produit: z.optional(z.number()),
  formulaire: z.optional(z.number()),
  version: z.optional(z.number()),
});

type FormSearchSchema = z.infer<typeof formSearchSchema>;

export const Route = createFileRoute("/_auth/opportunites/$uuid")({
  component: Opportunite,
  validateSearch: (search: Record<string, unknown>): FormSearchSchema =>
    formSearchSchema.parse(search),
  loaderDeps: ({ search }) => ({
    produit: search.produit,
    formulaire: search.formulaire,
    version: search.version,
  }),
  loader: async ({ context, deps, params }) => {
    // Chargement de l'opportunité
    const { data: headers } = await context.queryClient.fetchQuery({
      queryKey: ["opportunite", params.uuid],
      queryFn: () => {
        const filter = sfEqual("uuid", params.uuid).toString();
        return getHeaders(1, filter);
      },
    });
    // Gestion des erreurs de chargement de l'opportunité
    if (headers.data.length === 0)
      throw new Error("L'opportunité recherchée n'existe pas.");
    if (headers.data.length > 1)
      throw new Error(
        "Erreur serveur. Plusieurs opportunités ont été trouvées.",
      );
    // Création de l'opportunité à exporter
    const header = headers.data[0] as HeaderAPI;

    // Chargement des produits liés à l'opportunité
    const { data: produits } = await context.queryClient.fetchQuery({
      queryKey: ["produits", header.id],
      queryFn: () => {
        const filter = sfEqual("header", header.id).toString();
        return getProduits(1, filter);
      },
    });
    // Création du tableau des produits à exporter
    const listeProduits = produits.data as ProduitAPI[];

    // Chargement des réponses associées au produit
    const reponses: AnswerAPI[] = [];
    let hasNext = true;
    let page = 1;

    while (hasNext) {
      const { data: rep } = await context.queryClient.fetchQuery({
        queryKey: ["reponse", deps.produit, listeProduits],
        queryFn: () => {
          const filter = sfAnd([
            sfEqual("produit", deps.produit || listeProduits[0].id),
          ]).toString();
          return getAnswers(filter, page);
        },
      });
      hasNext = rep.hasNext;
      page++;
      reponses.push(...rep.data);
    }
    // Définition des formulaires associés au produit
    const formulaires = uniqBy(map(reponses, "formulaire"), "id") as FormAPI[];

    // Définition du formulaire sélectionné
    const selectedForm =
      deps.formulaire || (formulaires.length ? formulaires[0].id : null);
    // Définition de la réponse sélectionnée
    const selectedversion =
      deps.version ||
      (selectedForm
        ? find(reponses, (r) => r.formulaire.id === selectedForm && r.courante)
            ?.id
        : null);

    // Vérouillage de la réponse sélectionnée
    let versionLocked = false;
    const index = findIndex(reponses, (rep) => rep.id === selectedversion);
    // Vérification d'un vérouillage existant pour l'utilisateur
    if (
      index >= 0 &&
      !!reponses[index].lock &&
      reponses[index].lock.utilisateur.id === context.auth.user?.id
    ) {
      versionLocked = true;
    }
    if (
      context.auth.isUser &&
      index >= 0 &&
      !reponses[index].lock &&
      reponses[index].courante
    ) {
      const { data: lock } = await context.queryClient.fetchQuery({
        queryKey: ["lockReponse", selectedversion],
        queryFn: () => lockAnswer(selectedversion || 0),
      });
      versionLocked = lock;
    }

    // Retour des données sélectionnées pour la route
    return {
      header,
      produits: listeProduits,
      formulaires,
      reponses,
      selection: {
        produit: deps.produit || listeProduits[0].id,
        formulaire: selectedForm,
        version: selectedversion,
        versionLocked,
      },
    };
  },
  onLeave: async ({ loaderData }) => {
    // Suppression de l'éventuel verrou posé sur la réponse précédente
    if (loaderData) await unlockVersion(loaderData.selection);
  },
  errorComponent: ({ error }) => {
    return <ServerError error={error} />;
  },
});

function Opportunite() {
  // Hook de récupération des données
  const data = Route.useLoaderData();
  // Hook pour l'utilisation du router
  const router = useRouter();

  // Remise à jour des données suite à modification de l'opportunité
  const onChange = useCallback(() => {
    router.invalidate();
  }, [router]);

  /*****************************/
  // ouvrir l'explorateur de fichier
  // code à compléter et modifier
  const openFolder = useCallback(async (type: string) => {
    const path: string = "";
    try {
      window.alert(`Ouverture du répertoire ${type} ${path}`);
    } catch (error) {
      console.log(`Erreur ouverture répertoire ${type} ${path}`);
    }
  }, []);
  /*****************************/

  return (
    <Box sx={{ "& .MuiPaper-root": { mt: "20px" } }}>
      <Stack direction="row" spacing={2}>
        <Chip label={data.header.societe} color="primary" />
        {!!data.header.projet && (
          <Chip
            label={data.header.projet}
            color="primary"
            onClick={() => openFolder("projet")}
          />
        )}
        {!!data.header.opportunite && (
          <Chip
            label={data.header.opportunite}
            color="primary"
            onClick={() => openFolder("opportunite")}
          />
        )}
      </Stack>
      <Paper>
        <Box px={3} py={2}>
          <Entete header={data.header} onUpdated={onChange} />
        </Box>
      </Paper>
      <Paper>
        <Box px={3} py={2}>
          <Produits produits={data.produits} />
        </Box>
      </Paper>
      <Paper>
        <Box px={3} py={2}>
          <Formulaires formulaires={data.formulaires} />
          <Tabulation formulaires={data.formulaires} />
          {!!data.formulaires.length && (
            <Box>
              <Box m={1}>
                <Version />
                <Devis />
              </Box>
              <Info />
              <Reponse />
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
