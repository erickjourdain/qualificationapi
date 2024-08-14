import { useCallback, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { Box, Chip, IconButton, Typography } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Route as RteOpp } from "@/routes/_auth/opportunites/$uuid";
import { ProduitAPI } from "@/gec-tripetto";
import { useAuth } from "@/hooks/auth";
import { createProduit, updateProduit } from "@/utils/apiCall";
import manageError from "@/utils/manageError";
import { alertAtom } from "@/stores/mainStore";
import InputProduit from "./InputProduit";

interface ProduitsProps {
  produits: ProduitAPI[];
}

const Produits = ({ produits }: ProduitsProps) => {
  // Hook de navigation
  const navigate = useNavigate();
  // Hook de Gestion des autorisations
  const auth = useAuth();
  // Hook récupération produit sélectionné
  const { header, selection } = RteOpp.useLoaderData();
  // Hook état global du produit sélectionné
  const setAlerte = useSetAtom(alertAtom);

  // Etat local d'ouverture de la fenêtre de dialogue
  const [open, setOpen] = useState<boolean>(false);
  const [ajout, setAjout] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");

  // Enregistrement du produit
  const { mutate, isPending } = useMutation({
    mutationKey: ["produitOpportunite"],
    mutationFn: (value: string) => {
      return ajout
        ? createProduit({
            header: header.id,
            description: value,
          })
        : updateProduit({ id: selection.produit, description: value });
    },
    onSuccess: ({ data: reponse }) => {
      setAlerte({
        severite: "success",
        message: "enregistrement du produit réalisé",
      });
      navigate({
        search: (prev) => {
          return { ...prev, produit: reponse.id };
        },
      });
    },
    onError: (error) => {
      setAlerte({ severite: "error", message: manageError(error) });
    },
  });

  // Labncement enregistrement
  const handleSubmit = useCallback((description: string) => {
    setOpen(false);
    mutate(description);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fermeture de la boite de dialogue
  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  // Ouverture boite de dialogue pour ajout d'un produit
  const handleAjout = useCallback(() => {
    setAjout(true);
    setDescription("");
    setOpen(true);
  }, []);

  // Ouverture boite de dialogue pour modifictaion d'un produit
  const handleChange = useCallback((value: string) => {
    setAjout(false);
    setDescription(value);
    setOpen(true);
  }, []);

  return (
    <Box>
      <Typography variant="h6" color="secondary">
        Liste des produits
      </Typography>
      {produits.map((prod) => {
        return (
          <Chip
            key={prod.id}
            sx={{ mr: 2 }}
            label={prod.description}
            disabled={isPending}
            icon={prod.id === selection.produit ? <CheckCircleIcon /> : <></>}
            color="primary"
            variant={prod.id === selection.produit ? "filled" : "outlined"}
            onClick={() =>
              navigate({
                search: (prev) => {
                  return { ...prev, produit: prod.id };
                },
              })
            }
            onDoubleClick={() => handleChange(prod.description)}
          />
        );
      })}
      {auth.isUser && (
        <IconButton
          aria-label="ajout-produit"
          disabled={isPending}
          onClick={handleAjout}
        >
          <AddCircleIcon color="primary" />
        </IconButton>
      )}
      <InputProduit
        open={open}
        ajout={ajout}
        description={description}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    </Box>
  );
};

export default Produits;
