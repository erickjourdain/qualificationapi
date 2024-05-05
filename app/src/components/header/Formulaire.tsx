import React, { useState } from "react";
import { useSetAtom } from "jotai";
import { useMutation } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import HeaderForm from "../formulaire/HeaderForm";
import { InputField } from "../formulaire/InputField";
import BtnField from "../formulaire/BtnField";
import { HeaderAPI } from "../../gec-tripetto";
import { formatDateTime } from "../../utils/format";
import { updateHeader } from "../../utils/apiCall";
import manageError from "../../utils/manageError";
import { displayAlert } from "../../atomState";

interface FormulaireProps {
  header: HeaderAPI
  onChange: () => void;
}

const Formulaire = ({ header, onChange }: FormulaireProps) => {

  // Chargement de l'état Atom de gestion des alertes
  const setAlerte = useSetAtom(displayAlert);
    
  // State: ouverture / fermeture du formulaire
  const [disabled, setDisabled] = useState<boolean>(true);
  // State: état du formulaire
  const [isChanged, setIsChanged] = useState<boolean>(false);

  const { mutate} = useMutation({
    mutationFn: updateHeader,
    onSuccess: () => {
      setAlerte({ severite: "success", message: "enregistrement du produit réalisé" });
      setDisabled(true);
      onChange();
    },
    onError: (error) => {
      setAlerte({ severite: "error", message: manageError(error) });
    }
  })

  // Mise à jour des données de l'entête
  const onSubmit = (data: HeaderAPI) => {
    mutate({ ...data, id: header.id });
  }

  // Mise à jour de l'état du formulaire
  const onFormChange = (isDirty: boolean) => {
    setIsChanged(isDirty);
  }

  const defaultValues = {
    societe: header.societe,
    email: header.email,
    telephone: header.telephone,
    nom: header.nom,
    prenom: header.prenom,
    opportunite: header.opportunite,
    projet: header.projet
  }

  const societeProps = {
    name: "societe",
    className: "header-input",
    label: "raison sociale client",
    disabled: disabled,
    rules: {
      required: "La RS client est obligatoire",
      minLength: {
        value: 3,
        message: "La RS doit contenir au moins 3 caractères"
      },
      maxLength: {
        value: 155,
        message: "La RS ne peut contenir plus de 255 caractères.",
      }
    }
  }

  const emailProps = {
    name: "email",
    className: "header-input",
    label: "email du contact",
    disabled: disabled,
    rules: {
      required: "L'email est obligatoire",
      pattern: {
        value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        message: "L'adresse email est invalide",
      },
    }
  }

  const telephoneProps = {
    name: "telephone",
    className: "header-input",
    label: "telephone du contact",
    disabled: disabled,
    rules: {
      pattern: {
        value: /^(?:\+33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
        message: "Le numéro de téléphone est invalide",
      },
    }
  }

  const nomProps = {
    name: "nom",
    className: "header-input",
    label: "nom du contact",
    disabled: disabled,
    rules: {
      minLength: {
        value: 3,
        message: "Le nom doit contenir au moins 3 caractères"
      },
      maxLength: {
        value: 255,
        message: "Le nom ne peut contenir plus de 255 caractères.",
      }
    }
  }

  const prenomProps = {
    name: "prenom",
    className: "header-input",
    label: "prénom du contact",
    disabled: disabled,
    rules: {
      minLength: {
        value: 3,
        message: "Le prénom doit contenir au moins 3 caractères"
      },
      maxLength: {
        value: 255,
        message: "Le prénom ne peut contenir plus de 255 caractères.",
      }
    }
  }

  const opportuniteProps = {
    name: "opportunite",
    className: "header-input",
    label: "opportunité CRM",
    disabled: disabled,
    rules: {
      pattern: {
        value: /^OPP\d{7}$/,
        message: "La référence est incorrect",
      },
    }
  }

  const projetProps = {
    name: "projet",
    className: "header-input",
    label: "projet UBW",
    disabled: disabled,
    rules: {
      pattern: {
        value: /^P\d{6}$/,
        message: "La référence est incorrect",
      },
    }
  }

  return (
    <Box>
      <HeaderForm onSubmit={onSubmit} onChange={onFormChange} defaultValues={defaultValues}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} mb={3}>
          <Typography variant="caption">
            {`créé le ${formatDateTime(header.createdAt)} par ${header.createur.nom} ${header.createur.prenom}`}
            <br />
            {`modifié le ${formatDateTime(header.updatedAt)} par ${header.gestionnaire.nom} ${header.gestionnaire.prenom}`}
          </Typography>
          <Stack direction="column">
            <FormControlLabel control={<Switch checked={!disabled} onChange={() => setDisabled(!disabled)} />} label="Modifier" />
            <BtnField name="save" type="submit" label="Enregistrer" color="primary" disabled={disabled || !isChanged} />
          </Stack>
        </Stack>
        <InputField {...societeProps} />
        <InputField {...emailProps} />
        <InputField {...telephoneProps} />
        <InputField {...nomProps} />
        <InputField {...prenomProps} />
        <InputField {...opportuniteProps} />
        <InputField {...projetProps} />
      </HeaderForm>
    </Box>
  )
}

export default Formulaire;