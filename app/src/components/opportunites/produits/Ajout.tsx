import { SubmitHandler, useForm } from "react-hook-form";
import { useSetAtom } from "jotai";
import { Box, IconButton, TextField } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import { Route as oppRoute } from "@/routes/_auth/opportunites/$uuid";
import { useMutation } from "@tanstack/react-query";
import { createProduit } from "@/utils/apiCall";
import manageError from "@/utils/manageError";
import { alertAtom } from "@/stores/mainStore";

interface Inputs {
  id: number;
  description: string;
}

interface ProduitAddtProps {
  onClose: (update: boolean) => void;
}

const ProduitAdd = ({ onClose }: ProduitAddtProps) => {
  // Hook de récupération des données
  const data = oppRoute.useLoaderData();

  // Hook état global du produit sélectionné
  const setAlerte = useSetAtom(alertAtom);

  // Création du hook de gestion de la form
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<Inputs>();

  // Enregistrement du produit
  const { mutate, isPending } = useMutation({
    mutationFn: (inputs: Inputs) =>
      createProduit({
        header: data.header.id,
        description: inputs.description,
      }),
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
    mutate(data);
  };

  return (
    <Box>
      <TextField
        sx={{ width: "80%" }}
        size="small"
        id="description"
        label="description du produit à ajouter"
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
    </Box>
  );
};

export default ProduitAdd;
