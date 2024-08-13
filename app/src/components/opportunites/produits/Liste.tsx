import { useCallback, useState } from "react";
import { Box, Button, List, Typography } from "@mui/material";
import ProduitItem from "./Item";
import { ProduitAPI } from "@/gec-tripetto";
import { useAuth } from "@/hooks/auth";
import ProduitEdit from "./Edit";
import { router } from "@/App";
import ProduitAdd from "./Ajout";

interface ProduitsProps {
  produits: ProduitAPI[];
}

const Produits = ({ produits }: ProduitsProps) => {
  // Hook de Gestion des autorisations
  const auth = useAuth();

  // Etat local modification produit
  const [modification, setModification] = useState<ProduitAPI | null>(null);
  // Etat local ajout produit
  const [ajout, setAjout] = useState<boolean>(false);

  // Editer le produit
  const onEdit = useCallback((prod: ProduitAPI) => {
    setModification(prod);
  }, []);

  // Fermeture de la modification d'un produit
  const handleClose = (update: boolean) => {
    setModification(null);
    setAjout(false);
    if (update) router.invalidate();
  };

  const ListProduits = () => {
    return (
      <Box>
        <List component="nav" aria-label="liste produits">
          {produits.map((prod) => {
            if (modification && prod.id == modification.id)
              return (
                <ProduitEdit
                  key={prod.id}
                  prodItem={prod}
                  onClose={(update: boolean) => handleClose(update)}
                />
              );
            else
              return (
                <ProduitItem
                  key={prod.id}
                  prodItem={prod}
                  onEdit={() => onEdit(prod)}
                />
              );
          })}
        </List>
        {auth.isUser && ajout && (
          <ProduitAdd onClose={(update: boolean) => handleClose(update)} />
        )}
        {auth.isUser && !ajout && (
          <Box display="flex" justifyContent="flex-end">
            <Button color="primary" onClick={() => setAjout(true)}>
              Ajouter un produit
            </Button>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box>
      <Typography variant="h6">Produits</Typography>
      <ListProduits />
    </Box>
  );
};

export default Produits;
