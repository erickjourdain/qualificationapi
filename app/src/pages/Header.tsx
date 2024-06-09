import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { sfEqual } from "spring-filter-query-builder";
import { useSetAtom } from "jotai";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { getHeaders, getProduits } from "../utils/apiCall";
import manageError from "../utils/manageError";
import { displayAlert } from "../atomState";
import Formulaire from "../components/header/Formulaire";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Loading from "../components/Loading";
import Produits from "../components/header/Produits";
import Qualifications from "../components/qualifications/Qualifications";
import { ProduitAPI, ProduitsAPI } from "../gec-tripetto";

const Header = () => {

  // Récupération du paramètre de la route
  const { uuid } = useParams();

  // Hook de gestion des requêtes ver l'API
  const queryClient = useQueryClient();

  // Chargement de l'état Atom des alertes
  const setAlerte = useSetAtom(displayAlert);

  // State: le tableau des produits
  const [produits, setProduits] = useState<ProduitsAPI>();
  // State: le produit sélectionné
  const [produit, setProduit] = useState<ProduitAPI | null>(null);

  // Requête de récupération de l'entête
  const { data: header, isLoading: isLoadingHeader } = useQuery({
    queryKey: ["getHeader", uuid],
    queryFn: () => {
      if (!uuid) return null;
      const filter = sfEqual("uuid", uuid);
      return getHeaders(1, filter.toString());
    },
    select: (reponse) => (reponse && reponse.data.nbElements === 1) ? reponse.data.data[0] : undefined,
    throwOnError: (error, query) => {
      if (error) setAlerte({ severite: "error", message: manageError(error) });
      return true;
    },
  });

  /*
  // Requête de récupération des produits associés
  const { data: produits, isLoading: isLoadingProduits } = useQuery({
    queryKey: ["getProduits", header],
    queryFn: () => {
      const filter = sfEqual("header", header.id);
      const include = ["id", "createur", "gestionnaire", "description", "createdAt", "updatedAt"];
      return getProduits(1, filter.toString(), include);
    },
    select: (reponse) => reponse.data,
    enabled: !!header,
    throwOnError: (error, query) => {
      if (error) setAlerte({ severite: "error", message: manageError(error) });
      return true;
    },
  })
  */

  const { data: infiniteProduits, hasNextPage, fetchNextPage, isLoading: isLoadingProduits } = useInfiniteQuery({
    queryKey: ["getProduitsInfinite", header],
    queryFn: async ({ pageParam }) => {
      const filter = sfEqual("header", header.id);
      const include = ["id", "description"];
      const produits = await getProduits(pageParam, filter.toString(), include);
      return produits.data as ProduitsAPI;
    },
    initialPageParam: 1,
    getNextPageParam: (produits) => (produits.hasNext) ? produits.page + 1 : undefined,
    enabled: !!header,
    throwOnError: (error, query) => {
      if (error) setAlerte({ severite: "error", message: manageError(error) });
      return true;
    },
  });

  // Mise à jour du tableau des produits suite récupération des données
  useEffect(() => {
    const prod: ProduitAPI[] = [];
    infiniteProduits?.pages.map(p => p.data.map(data => {
      prod.push(data)
    }))
    setProduits({data: prod, nbElements: prod.length, hasNext: false, hasPrevious: false, page: 1, size: prod.length});
    if (hasNextPage) fetchNextPage();
  }, [infiniteProduits])

  // Relance des requêtes suite modifications
  const onChange = () => {
    queryClient.invalidateQueries({ queryKey: ["getHeader"]});
    queryClient.invalidateQueries({ queryKey: ["getProduits"]});
    queryClient.invalidateQueries({ queryKey: ["getProduitsInfinite"]});
  }

  // Sélection du produit
  const handleSelectProduct = (produit: ProduitAPI) => {
    setProduit(produit);
  }

  // ouvrir l'explorateur de fichier
  // code à compléter et modifier
  const openFolder = (type: string) => {
    let path = process.env.GECDOCUMENT_PATH;
    if (type === "projet") path = `${path}/PROJET/${header.projet}`;
    if (type === "opportunite") path = `${path}/OPPORTUNITE/${header.opportunite}`;
    alert(`open ${path}`);
  }

  if (isLoadingHeader || isLoadingProduits) return (<Loading />)

  return (
    <Box sx={{ "& .MuiPaper-root": { mt: "20px" } }}>
      <Stack direction="row" spacing={2}>
        <Chip label={header.societe} color="primary" />
        {!!header.projet && <Chip label={header.projet} color="primary" onClick={() => openFolder("projet")} />}
        {!!header.opportunite && <Chip label={header.opportunite} color="primary" onClick={() => openFolder("opportunite")}/>}
      </Stack>
      <Paper
      >
        <Box px={3} py={2}>
          {header && <Formulaire header={header} onChange={onChange} />}
        </Box>
      </Paper>
      <Paper
      >
        <Box px={3} py={2}>
          {produits && <Produits headerId={header.id} produits={produits} onChange={onChange} onSelect={handleSelectProduct} />}
        </Box>
      </Paper>
      <Paper>
        <Box px={3} py={2}>
          <Qualifications produit={produit} />
        </Box>
      </Paper>
    </Box>
  )
}

export default Header;