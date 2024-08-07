import { useMutation } from "@tanstack/react-query";
import { useBlocker, useNavigate } from "@tanstack/react-router";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { useSetAtom } from "jotai";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { createHeadersWithProducts } from "@/utils/apiCall";
import manageError from "@/utils/manageError";
import { alertAtom } from "@/stores/mainStore";

interface Produit {
  description: string;
}

interface Inputs {
  societe: string;
  email: string;
  telephone: string;
  nom: string;
  prenom: string;
  opportunite: string;
  projet: string;
  produits: Produit[];
}

const Nouvelle = () => {
  // Hook de navigation
  const navigate = useNavigate();

  // Hook de gestion des Alertes
  const setAlerte = useSetAtom(alertAtom);

  // Création du hook pour la gestion du formulaire
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    register,
    reset,
  } = useForm<Inputs>({
    defaultValues: {
      societe: "",
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      projet: "",
      opportunite: "",
      produits: [{ description: "" }],
    },
  });

  // Création du tableau des produits associés à l'opportunité
  const { fields, append, remove } = useFieldArray({
    control,
    name: "produits",
    rules: { minLength: 1 },
  });

  // Hook de confirmation de la perte des données
  useBlocker({
    blockerFn: () =>
      window.confirm(
        "Les données n'ont pas été sauvegardée! Souhaitez-vous continuez?",
      ),
    condition: isDirty,
  });

  // Enregistrement de la nouvelle entrée
  const { mutate, isPending } = useMutation({
    mutationFn: createHeadersWithProducts,
    onSuccess: () => {
      setAlerte({
        severite: "success",
        message: "L'opportunité a été créée avec succès",
      });
      navigate({ to: "/opportunites" });
    },
    onError: (error) =>
      setAlerte({ severite: "error", message: manageError(error) }),
  });

  // soumission du formulaire
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutate({
      ...data,
      produits: data.produits.map((produit) => produit.description),
    });
  };

  // annulation de l'enregistrement
  const onFinish = () => {
    navigate({ to: "/opportunites" });
  };

  return (
    <Paper
      sx={{
        marginTop: "10px",
      }}
    >
      <Box px={3} py={2}>
        <Typography variant="h5" sx={{ m: 2 }}>
          Nouvelle Oppportunité
        </Typography>

        <Box
          component="form"
          sx={{
            "& .header-input": { m: 1, width: "30%" },
            "& .product-input": { m: 1, width: "85%" },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            required
            id="societe"
            className="header-input"
            label="raison sociale du client"
            {...register("societe", {
              required: "La RS est obligatoire",
              minLength: {
                value: 3,
                message: "La RS doit contenir au moins 3 caractères",
              },
              maxLength: {
                value: 155,
                message: "La RS ne peut contenir plus de 255 caractères.",
              },
            })}
            error={errors.societe ? true : false}
            helperText={errors.societe?.message}
          />

          <TextField
            required
            id="email"
            className="header-input"
            label="email du contact"
            {...register("email", {
              required: "L'email est obligatoire",
              pattern: {
                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "L'adresse email est invalide",
              },
            })}
            error={errors.email ? true : false}
            helperText={errors.email?.message}
          />

          <TextField
            id="nom"
            className="header-input"
            label="nom du contact"
            {...register("nom", {
              minLength: {
                value: 3,
                message: "La nom doit contenir au moins 3 caractères",
              },
              maxLength: {
                value: 255,
                message: "La nom ne peut contenir plus de 255 caractères.",
              },
            })}
            error={errors.nom ? true : false}
            helperText={errors.nom?.message}
          />

          <TextField
            id="prenom"
            className="header-input"
            label="prenom du contact"
            {...register("prenom", {
              minLength: {
                value: 3,
                message: "Le prénom doit contenir au moins 3 caractères",
              },
              maxLength: {
                value: 255,
                message: "Le prénom ne peut contenir plus de 255 caractères.",
              },
            })}
            error={errors.prenom ? true : false}
            helperText={errors.prenom?.message}
          />

          <TextField
            id="telephone"
            className="header-input"
            label="telephone du contact"
            {...register("telephone", {
              pattern: {
                value: /^(?:\+33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
                message: "Le numéro de téléphone est invalide",
              },
            })}
            error={errors.telephone ? true : false}
            helperText={errors.telephone?.message}
          />

          <TextField
            id="opportunite"
            className="header-input"
            label="référence opportunité CRM"
            {...register("opportunite", {
              pattern: {
                value: /^OPP\d{7}$/,
                message: "La référence est incorrect",
              },
            })}
            error={errors.opportunite ? true : false}
            helperText={errors.opportunite?.message}
          />

          <TextField
            id="projet"
            className="header-input"
            label="référence projet UBW"
            {...register("projet", {
              pattern: {
                value: /^P\d{6}$/,
                message: "La référnce est incorrect",
              },
            })}
            error={errors.projet ? true : false}
            helperText={errors.projet?.message}
          />

          <Divider />

          <Typography variant="h6" sx={{ m: 2 }}>
            Liste des produits associés à l'opportunité
          </Typography>

          {fields.map((field, index) => (
            <Box key={field.id} sx={{ display: "flex", alignItems: "center" }}>
              <TextField
                className="product-input"
                id={`produit_${field.id}`}
                label={`description produit n°${index + 1}`}
                {...register(`produits.${index}.description`, {
                  required: "La description du produit est obligatoire",
                  minLength: {
                    value: 10,
                    message: "Le produit doit contenir au moins 10 caractères",
                  },
                  maxLength: {
                    value: 255,
                    message:
                      "Le produit ne peut contenir plus de 255 caractères.",
                  },
                })}
                error={errors.produits ? true : false}
                helperText={errors.produits?.[index]?.description?.message}
              />
              {index > 0 && (
                <Tooltip title="supprimer le produit">
                  <IconButton
                    aria-label="delete-product"
                    color="error"
                    size="large"
                    onClick={() => remove(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          ))}
          <br />
          <Box ml={1} mb={1}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => append({ description: "" })}
            >
              Ajouter un produit
            </Button>
          </Box>

          <Divider />

          <Box mt={3}>
            <Stack spacing={2} direction="row">
              <Button
                variant="contained"
                color="primary"
                disabled={isPending}
                onClick={handleSubmit(onSubmit)}
              >
                Enregistrer
              </Button>
              <Button
                variant="contained"
                color="warning"
                disabled={isPending}
                onClick={() => reset()}
              >
                Reset
              </Button>
              <Button
                variant="contained"
                color="secondary"
                disabled={isPending}
                onClick={onFinish}
              >
                Annuler
              </Button>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default Nouvelle;
