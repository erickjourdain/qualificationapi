import React, { useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { useMutation } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import { Chip, IconButton, Typography } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { ProduitAPI, ProduitsAPI } from "../../gec-tripetto";
import { displayAlert, loggedUser } from "../../atomState";
import InputProduit from "./InputProduit";
import { createProduit, updateProduit } from "../../utils/apiCall";
import manageError from "../../utils/manageError";

interface ProduitsProps {
  headerId: number;
  produits: ProduitsAPI;
  onChange: () => void;
  onSelect: (produit: ProduitAPI) => void;
}

const Produits = ({ headerId, produits, onChange, onSelect }: ProduitsProps) => {

  // Chargement de l'utilisateur connecté
  const user = useAtomValue(loggedUser);
  // Chargement de l'état Atom de gestion des alertes
  const setAlerte = useSetAtom(displayAlert);

  // State: le produit sélectionné
  const [produit, setProduit] = useState<ProduitAPI | null>(null);
  // State: modification du produit
  const [modification, setModification] = useState<boolean>(false);
  // State: ajout d'un produi
  const [ajout, setAjout] = useState<boolean>(false);
  // State: varibale description
  const [description, setDescription] = useState<string>("");

  // Définition du produit sélectionné lors de la mise à joour de liste
  useEffect(() => {
    if (produits.data[0]) setProduit(produits.data[0]);
  }, [produits]);

  // Mise à jour du produit sélectionné
  useEffect(() => {
    if (produit) {
      setAjout(false);
      setModification(false);
      setDescription("");
      onSelect(produit);
    }
  }, [produit]);

  // Enregistrement du produit
  const { mutate, isPending } = useMutation({
    mutationKey: ["produitOpportunite"],
    mutationFn: (value: string) => {
      return (ajout)
        ? createProduit({
          header: headerId,
          description: value,
        })
        : updateProduit({ id: produit?.id || 0, description: value })
    },
    onSuccess: () => {
      setAlerte({
        severite: "success",
        message: "enregistrement du produit réalisé",
      });
      onChange();
    },
    onError: (error) => {
      setAlerte({ severite: "error", message: manageError(error) });
    },
  });

  // Editer le produit
  const onEdit = (prod: ProduitAPI) => {
    setModification(true);
    setDescription(prod.description);
  }

  // Fermeture de la modification d'un produit
  const handleClose = () => {
    setModification(false);
    setAjout(false);
  }

  // Lancement de l'enregistrement
  const handleSubmit = (value: string) => {
    mutate(value);
  }

  return (
    <Box>
      <Typography variant="h6">Liste des produits</Typography>
      {
        produits.data.map(prod => {
          return <Chip
            key={prod.id}
            sx={{ mr: 2 }}
            label={prod.description}
            disabled={isPending}
            icon={(prod.id === produit?.id) ? <CheckCircleIcon /> : <></>}
            color="primary"
            variant={(prod.id === produit?.id) ? "filled" : "outlined"}
            onClick={() => setProduit(prod)}
            onDoubleClick={() => onEdit(prod)}
          />
        })
      }
      {
        user?.role !== "READER" &&
        <IconButton
          aria-label="ajout-produit"
          disabled={isPending || ajout}
          onClick={() => setAjout(true)}
        >
          <AddCircleIcon color="primary" />
        </IconButton>
      }
      <InputProduit
        open={ajout || modification}
        ajout={ajout}
        description={description}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    </Box>
  )
}

export default Produits