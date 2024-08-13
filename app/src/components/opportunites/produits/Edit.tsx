import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import {
  Checkbox,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import { alertAtom } from "@/stores/mainStore";
import { ProduitAPI } from "@/gec-tripetto";
import manageError from "@/utils/manageError";
import { updateProduit } from "@/utils/apiCall";
import { Route } from "@/routes/_auth/opportunites/$uuid";

interface Inputs {
  id: number;
  description: string;
}

interface ProduitEditProps {
  prodItem: ProduitAPI;
  onClose: (update: boolean) => void;
}

const ProduitEdit = ({ prodItem, onClose }: ProduitEditProps) => {
  // Hook état global du produit sélectionné
  const setAlerte = useSetAtom(alertAtom);
  // Hook récupération produit sélectionné
  const { selection } = Route.useLoaderData();

  // Création du hook de gestion de la form
  const {
    formState: { errors, isDirty },
    handleSubmit,
    register,
    setValue,
  } = useForm<Inputs>();

  //const labelId = `checkbox-produit-${prodItem.id}`;

  // Chargement des données lors de la mise à jour du produit
  useEffect(() => {
    setValue("id", prodItem.id);
    setValue("description", prodItem.description);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prodItem]);

  // Enregistrement du produit
  const { mutate, isPending } = useMutation({
    mutationFn: (data: Inputs) =>
      updateProduit({ id: data.id, description: data.description }),
    onSuccess: () => {
      setAlerte({
        severite: "success",
        message: "enregistrement du produit réalisé",
      });
      onClose(true);
    },
    onError: (error) => {
      setAlerte({ severite: "error", message: manageError(error) });
    },
  });

  // Validation de la description du produit
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    if (isDirty) mutate(data);
    else onClose(false);
  };

  return (
    <ListItem
      secondaryAction={
        <>
          <IconButton
            edge="end"
            aria-label="edit"
            color="primary"
            onClick={handleSubmit(onSubmit)}
            disabled={isPending}
          >
            <CheckCircleIcon />
          </IconButton>
          <IconButton
            edge="end"
            aria-label="edit"
            color="warning"
            onClick={() => onClose(false)}
            disabled={isPending}
          >
            <CloseIcon />
          </IconButton>
        </>
      }
      disablePadding
    >
      <ListItemButton selected={prodItem.id === selection.produit}>
        <ListItemIcon>
          <Checkbox
            id={`checkbox-selection-${prodItem.id}`}
            edge="start"
            checked={prodItem.id === selection.produit}
            tabIndex={-1}
            disableRipple
          />
        </ListItemIcon>
        <ListItemText>
          <TextField
            sx={{ width: "80%" }}
            id={`description-${selection.produit}`}
            {...register("description", {
              required: "La description du produit est obligatoire",
              minLength: {
                value: 10,
                message: "Le produit doit contenir au moins 10 caractères",
              },
              maxLength: {
                value: 255,
                message: "Le produit ne peut contenir plus de 255 caractères.",
              },
            })}
            error={errors.description ? true : false}
            helperText={errors.description?.message}
          />
        </ListItemText>
      </ListItemButton>
    </ListItem>
  );
};

export default ProduitEdit;
