import { useCallback, useEffect } from 'react';
import { useAtom } from 'jotai';
import { createFileRoute, Outlet, useRouter } from '@tanstack/react-router';
import { sfEqual } from 'spring-filter-query-builder';
import { Box, Chip, Paper, Stack } from '@mui/material';
import ServerError from '@/components/ServerError';
import Entete from '@/components/opportunites/Entete';
import { HeaderAPI, ProduitAPI } from '@/gec-tripetto';
import { getHeaders, getProduits } from '@/utils/apiCall';
import Produits from '@/components/opportunites/produits/Liste';
import { produitAtom } from '@/stores/oppStore';

export const Route = createFileRoute('/_mainLayout/_auth/opportunites/$uuid')({
  component: Opportunite,
  loader: async ({ context, params }) => {
    const { data: headers } = await context.queryClient.fetchQuery({
      queryKey: ["getHeader", params.uuid],
      queryFn: () => {
        const filter = sfEqual("uuid", params.uuid).toString();
        return getHeaders(1, filter);
      },
    });
    if (headers.data.length === 0) throw new Error("L'opportunité recherchée n'existe pas.");
    if (headers.data.length > 1) throw new Error("Erreur serveur. Plusieurs opportunités ont été trouvées.");
    const header = headers.data[0] as HeaderAPI;

    const { data: produits } = await context.queryClient.fetchQuery({
      queryKey: ["getProduits", header.id],
      queryFn: () => {
        const filter = sfEqual("header", header.id).toString();
        const include = ["id", "description"];
        return getProduits(1, filter, include);
      },
    });

    return { ...header, produits: produits.data as ProduitAPI[] };
  },
  errorComponent: ({ error }) => {
    return <ServerError error={error} />;
  }
})

function Opportunite() {

  // Hook de récupération des données
  const header = Route.useLoaderData();
  // Hook pour l'utilisation du router
  const router = useRouter();
  // Hook état global du produit sélectionné
  const [produit, setProduit] = useAtom(produitAtom);  

  // Remise à jour des données suite à modification de l'opportunité
  const onChange = useCallback(() => {
    router.invalidate();
  }, []);

  useEffect(() => {
    setProduit(header.produits[0]);
  }, [header.produits]);

  /*****************************/
  // ouvrir l'explorateur de fichier
  // code à compléter et modifier
  const openFolder = useCallback(async (type: string) => {
    let path: string = "";
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
        <Chip label={header.societe} color="primary" />
        {!!header.projet && <Chip label={header.projet} color="primary" onClick={() => openFolder("projet")} />}
        {!!header.opportunite && <Chip label={header.opportunite} color="primary" onClick={() => openFolder("opportunite")} />}
      </Stack>
      <Paper>
        <Box px={3} py={2} >
          <Entete header={header} onUpdated={onChange} />
        </Box>
      </Paper>
      <Paper>
        <Box px={3} py={2}>
          <Produits produits={header.produits} />
        </Box>
      </Paper>

      <Outlet />

    </Box>
  )
}