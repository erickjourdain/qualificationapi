import React, { useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
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
import { ProduitAPI } from "../gec-tripetto";

const Header = () => {

  // Récupération du paramètre de la route
  const { uuid } = useParams();

  // Chargement de l'état Atom des alertes
  const setAlerte = useSetAtom(displayAlert);

  // State: le produit sélectionné
  const [produit, setProduit] = useState<ProduitAPI | null>(null);

  // Requête de récupération de l'entête
  const { data: header, isLoading: isLoadingHeader, refetch: refetchHeader } = useQuery({
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

  // Requête de récupération des produits associés
  const { data: produits, isLoading: isLoadingProduits, refetch: refetchProduits } = useQuery({
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

  const handleSelectProduct = (produit: ProduitAPI) => {
    setProduit(produit);
  }

  if (isLoadingHeader || isLoadingProduits) return (<Loading />)

  return (
    <Box sx={{ "& .MuiPaper-root": { mt: "20px" } }}>
      <Stack direction="row" spacing={2}>
        <Chip label={header.societe} color="primary" />
        {!!header.projet && <Chip label={header.projet} color="primary" />}
        {!!header.opportunite && <Chip label={header.opportunite} color="primary" />}
      </Stack>
      <Paper
      >
        <Box px={3} py={2}>
          {header && <Formulaire header={header} onChange={refetchHeader} />}
        </Box>
      </Paper>
      <Paper
      >
        <Box px={3} py={2}>
          {produits && <Produits headerId={header.id} produits={produits} onChange={refetchProduits} onSelect={handleSelectProduct} />}
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