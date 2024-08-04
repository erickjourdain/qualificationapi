import { useCallback, useState } from "react";
import { useAtom } from "jotai";
import { Box, Button, List, Typography } from "@mui/material";
import ProduitItem from "./Item";
import { ProduitAPI } from "@/gec-tripetto";
import { produitAtom } from "@/stores/oppStore";
import { useAuth } from "@/hooks/auth";
import ProduitEdit from "./Edit";
import { router } from "@/App";
import ProduitAdd from "./Ajout";

interface ProduitsProps {
  produits: ProduitAPI[]
}

const Produits = ({ produits }: ProduitsProps) => {

  // Hook de Gestion des autorisations
  const auth = useAuth();
  // Hook état global du produit sélectionné
  const [produit, setProduit] = useAtom(produitAtom);  

  // Etat local modification produit
  const [modification, setModification] = useState<boolean>(false);
  // Etat local ajout produit
  const [ajout, setAjout] = useState<boolean>(false);

  // Editer le produit
  const onEdit = useCallback((prod: ProduitAPI) => {
    setProduit(prod);
    setModification(true);
  }, []);

  // Fermeture de la modification d'un produit
  const handleClose = (update: boolean) => {
    setModification(false);
    setAjout(false);
    if (update) router.invalidate();
  }

  const ListProduits = () => {
    return (
      <Box>
        <List component="nav" aria-label="liste produits">
          {
            produits.map((prod) => {
              if (modification && (prod.id == produit?.id))
                return <ProduitEdit
                  key={prod.id}
                  prodItem={prod}
                  onClose={(update: boolean) => handleClose(update)}
                />
              else
                return <ProduitItem
                  key={prod.id}
                  prodItem={prod}
                  onEdit={() => onEdit(prod)}
                />
            })
          }
        </List>
        {
          auth.isUser && ajout &&
          <ProduitAdd onClose={(update: boolean) => handleClose(update)} />
        }
        {
          auth.isUser && !ajout &&
          <Box display="flex" justifyContent="flex-end">
            <Button color="primary" onClick={() => setAjout(true)}>
              Ajouter un produit
            </Button>
          </Box>
        }
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h6">Produits</Typography>
      <ListProduits />
    </Box>
  )
}

export default Produits;