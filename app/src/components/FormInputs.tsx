import React from "react";
import Ajv from "ajv";
import { SubmitHandler, useForm } from "react-hook-form";
import { ChangeEvent, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import QuizIcon from "@mui/icons-material/Quiz";
import ClearIcon from "@mui/icons-material/Clear";
import ContentPasteGoIcon from "@mui/icons-material/ContentPasteGo";
import TripettoSchema from "../types/tripettoSchema.json";

type FormInputsProps = {
  form: {
    titre: string;
    description: string | null;
    formulaire: string;
  };
  onSubmit: SubmitHandler<{
    titre: string;
    description: string | null;
    formulaire: string;
  }>;
  onFinish?: () => void;
  onUpdateFormulaire?: (val: boolean) => void;
  onTestFormulaire: (formulaire: string) => void;
};

// définition du type pour la gestion de l'état local
type State = {
  updateFormulaire: boolean;
  testFormulaire: boolean;
};

/**
 * Composant de gestion du formulaire de création et de mise à jour des données formulaire
 * @param props FormInputsProps
 * @returns JSX
 */
const FormInputs = ({ form, onSubmit, onFinish, onUpdateFormulaire, onTestFormulaire }: FormInputsProps) => {
  // définition de l'état du composant pour gestion de la MAJ des données
  // du formulaire Tripetto
  const [state, setState] = useState<State>({
    updateFormulaire: false || onUpdateFormulaire === undefined,
    testFormulaire: false,
  });

  // définition du texte du bouton de sauvegarde en fonction du contexte
  const btnSauvegarde = onUpdateFormulaire === undefined ? "Enregistrer" : "Mettre à jour";

  // validation du formulaire Tripetto
  const validateFormulaire = (value: string) => {
    try {
      const ajv = new Ajv({
        allowUnionTypes: true,
        validateSchema: false,
      });
      const validateForm = ajv.compile(TripettoSchema);
      validateForm(JSON.parse(value));
      if (validateForm.errors) throw new Error();
      return true;
    } catch (_err) {
      return "Formulaire Tripetto invalide.";
    }
  };

  // Gestion du changement d'état du switch pour la mise à jour des données du formulaire Tripetto
  const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [ev.target.name]: ev.target.checked,
    });
    if (onUpdateFormulaire) onUpdateFormulaire(ev.target.checked);
  };

  // Lancement du test du formulaire
  const handleTestFormulaire = () => {
    const formulaire = getValues("formulaire");
    const valideForm = validateFormulaire(formulaire);
    if (valideForm === true) onTestFormulaire(formulaire);
    else setError("formulaire", { type: "validation", message: "Formulaire Tripetto invalide." });
  };

  // copier le presse papier dans le champ formulaire
  const handlePaste = () => {
    navigator.clipboard.readText().then((text) => setValue("formulaire", text));
  };

  // enregistrement des composants de la forme pour utilisation par le Hook de react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    reset,
    setError,
    clearErrors
  } = useForm({
    defaultValues: {
      titre: form.titre,
      description: form.description,
      formulaire: form.formulaire,
    },
  });

  return (
    <>
      <TextField
        required
        id="titre"
        label="Titre du formulaire"
        fullWidth
        margin="dense"
        {...register("titre", {
          required: "Le titre est obligatoire.",
          minLength: {
            value: 5,
            message: "Le titre doit contenir au moins 5 caractères.",
          },
          maxLength: {
            value: 155,
            message: "Le titre ne peut contenir plus de 155 caractères.",
          },
        })}
        error={errors.titre ? true : false}
      />
      <Typography variant="inherit" color="error">
        {errors.titre?.message}
      </Typography>
      <TextField
        id="description"
        label="Description"
        multiline
        rows={3}
        fullWidth
        margin="dense"
        {...register("description", {
          minLength: {
            value: 25,
            message: "La description doit contenir au moins 25 caractères.",
          },
          maxLength: {
            value: 255,
            message: "La description ne peut contenir plus de 255 caractères.",
          },
        })}
        error={errors.description ? true : false}
      />
      <Typography variant="inherit" color="error">
        {errors.description?.message}
      </Typography>
      <Stack spacing={2} direction="row">
        {onUpdateFormulaire && (
          <FormControlLabel
            control={<Switch checked={state.updateFormulaire} onChange={handleChange} name="updateFormulaire" />}
            label="MAJ Formulaire"
          />
        )}
        <Button variant="outlined" color="secondary" endIcon={<QuizIcon />} onClick={handleTestFormulaire}>
          Tester
        </Button>
        <Button variant="outlined" color="primary" endIcon={<ContentPasteGoIcon />} onClick={handlePaste}>
          Coller
        </Button>
        <Button
          variant="outlined"
          color="warning"
          endIcon={<ClearIcon />}
          disabled={!state.updateFormulaire}
          onClick={() => setValue("formulaire", "")}
        >
          Effacer
        </Button>
      </Stack>
      <TextField
        required
        id="formulaire"
        label="Formulaire Tripetto"
        multiline
        rows={5}
        fullWidth
        margin="dense"
        disabled={!state.updateFormulaire}
        {...register("formulaire", {
          required: "Le formulaire est obligatoire.",
          validate: validateFormulaire,
        })}
        error={errors.formulaire ? true : false}
      />
      <Typography variant="inherit" color="error">
        {errors.formulaire?.message}
      </Typography>
      <Typography variant="inherit" color="error">
        {errors.root?.message}
      </Typography>
      <Box mt={3}>
        <Stack spacing={2} direction="row">
          <Button variant="contained" color="primary" onClick={handleSubmit(onSubmit)}>
            {btnSauvegarde}
          </Button>
          <Button variant="contained" color="warning" onClick={() => reset()}>
            Reset
          </Button>
          <Button variant="contained" color="secondary" onClick={onFinish}>
            Annuler
          </Button>
        </Stack>
      </Box>
    </>
  );
};

export default FormInputs;
