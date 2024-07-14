import React, { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import { Button, Typography } from "@mui/material";
import { ProduitAPI, ProduitsAPI } from "../../gec-tripetto";
import { loggedUser } from "../../atomState";
import ProduitItem from "./ProduitItem";
import ProduitEdit from "./ProduitEdit";
import ProduitAdd from "./ProduitAdd";

interface ProduitsProps {
  headerId: number;
  produits: ProduitsAPI;
  onChange: () => void;
  onSelect: (produit: ProduitAPI) => void
}

const Produits = ({ headerId, produits, onChange, onSelect }: ProduitsProps) => {

  // Chargement de l'utilisateur connecté
  const user = useAtomValue(loggedUser);

  // State: le produit sélectionné
  const [produit, setProduit] = useState<ProduitAPI | null>(null);
  // State: modification du produit
  const [modification, setModification] = useState<boolean>(false);
  // State: ajout d'un produi
  const [ajout, setAjout] = useState<boolean>(false);

  // Définition du produit sélectionné lors de la mise à joour de liste
  useEffect(() => {
    if (produits.data[0]) setProduit(produits.data[0]);
  }, [produits]);

  // Mise à jour du produit sélectionné
  useEffect(() => {
    if (produit) {
      onSelect(produit);
      setAjout(false);
    }
  }, [produit]);

  // Editer le produit
  const onEdit = (prod: ProduitAPI) => {
    setProduit(prod);
    setModification(true);
  }

  // Fermeture de la modification d'un produit
  const handleClose = (update: boolean) => {
    setModification(false);
    setAjout(false);
    if (update) onChange();
  }

  const ListProduits = () => {
    return (
      <Box>
        <List component="nav" aria-label="liste produits">
          {
            produits.data.map((prod) => {
              if (modification && (prod.id == produit?.id))
                return <ProduitEdit
                  key={prod.id}
                  produit={prod}
                  selected={prod.id === produit?.id}
                  onClose={(update: boolean) => handleClose(update)}
                />
              else
                return <ProduitItem
                  key={prod.id}
                  produit={prod}
                  selected={prod.id === produit?.id}
                  onSelect={() => setProduit(prod)}
                  onEdit={() => onEdit(prod)}
                />
            })
          }
        </List>
        {
          (user?.role !== "READER") && ajout && 
          <ProduitAdd header={headerId} onClose={(update: boolean) => handleClose(update)}/>
        }
        {
          (user?.role !== "READER") && !ajout &&
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

export default Produits