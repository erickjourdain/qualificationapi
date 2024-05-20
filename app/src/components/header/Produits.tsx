import React, { useEffect, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { useMutation } from "@tanstack/react-query"
import { SubmitHandler, useForm } from "react-hook-form"
import Box from "@mui/material/Box"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import Stack from "@mui/material/Stack"
import Tooltip from "@mui/material/Tooltip"
import TextField from "@mui/material/TextField"
import IconButton from "@mui/material/IconButton"
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { displayAlert, loggedUser } from "../../atomState"
import { ProduitAPI, ProduitsAPI } from "../../gec-tripetto"
import { createProduit, updateProduit } from "../../utils/apiCall"
import manageError from "../../utils/manageError"

interface Inputs {
  id: number | null;
  description: string;
}

interface ProduitsProps {
  headerId: number;
  produits: ProduitsAPI;
  onChange: () => void;
  onSelect: (produit: ProduitAPI) => void
}

const Produits = ({ headerId, produits, onChange, onSelect }: ProduitsProps) => {

  // Chargement utilisateur connecté
  const user = useAtomValue(loggedUser);
  // Chargement de l'état Atom de gestion des alertes
  const setAlerte = useSetAtom(displayAlert);

  // State: le produit sélectionné
  const [produit, setProduit] = useState<ProduitAPI | null>(null);
  // State: modification du produit
  const [modification, setModification] = useState<boolean>(false);

  // Création du hook de gestion de la forme
  const { formState: { errors }, handleSubmit, register, setValue, getValues } = useForm<Inputs>()

  // Modification du produit sélectionné
  const handleChange = (value: string) => {
    const selection = produits.data.find((prod) => prod.id.toString() === value);
    if (selection) {
      setProduit(selection);
      onSelect(selection);
    }
  }

  // Mise à jour de la liste des produits
  useEffect(() => {
    if (produits.nbElements) {
      setProduit(produits.data[0]);
      onSelect(produits.data[0])
    }
    else setProduit(null);
  }, [produits]);

  // Enregistrement du produit
  const { mutate, isPending } = useMutation({
    mutationFn: (data: Inputs) => {
      if (data.id) return updateProduit({ id: data.id, description: data.description })
      else return createProduit({ header: headerId, description: data.description });
    },
    onSuccess: () => {
      setAlerte({ severite: "success", message: "enregistrement du produit réalisé" });
      setValue("id", null);
      setValue("description", "");
      setModification(false);
      onChange();
    },
    onError: (error) => {
      setAlerte({ severite: "error", message: manageError(error) });
    }
  })

  // Editer le produit
  const onEdit = () => {
    if (produit) {
      setValue("id", produit.id);
      setValue("description", produit.description);
      setModification(true);
    }
  }

  // Ajouter un produit
  const onAddProduct = () => {
    setValue("id", null);
    setValue("description", "");
    setModification(true);
  }

  // Validation de la description du produit
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutate(data);
  }

  const SelectionProduit = () => {
    if (produit && !modification) return (
      <Stack direction="row" width="100%">
        <InputLabel id="produit-select-label">Produit</InputLabel>
        <Select
          labelId="produit-select-label"
          id="reponse-versions-select"
          size="small"
          value={produit.id.toString()}
          label="Produit"
          onChange={(evt: SelectChangeEvent) => {
            handleChange(evt.target.value);
          }}
          fullWidth
        >
          {produits.data.map((prod) => (
            <MenuItem value={prod.id.toString()} key={prod.id}>
              {prod.description}
            </MenuItem>
          ))}
        </Select>
        {
          (user && user.role !== "READER") &&
          <>
            <Tooltip title="Modifier produit" placement="left">
              <IconButton color="warning" onClick={onEdit}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Ajouter un produit" placement="left">
              <IconButton color="primary" onClick={onAddProduct}>
                <AddCircleIcon />
              </IconButton>
            </Tooltip>
          </>
        }
      </Stack>
    )
  }

  const ModificationProduit = () => {
    if (!produit || modification) {
      const label = (getValues("id")) ? "Mettre à jour le produit" : "Ajouter un produit";

      return (
        <Box component="form" noValidate autoComplete="off" width="100%">
          <Stack direction="row" width="100%">
            <TextField
              id="produit"
              label={label}
              size="small"
              fullWidth
              {
              ...register("description", {
                required: "La description du produit est obligatoire",
                minLength: {
                  value: 10,
                  message: "Le produit doit contenir au moins 10 caractères"
                },
                maxLength: {
                  value: 255,
                  message: "Le produit ne peut contenir plus de 255 caractères.",
                }
              })}
              error={errors.description ? true : false}
              helperText={errors.description?.message}
            />
            <IconButton color="primary" onClick={handleSubmit(onSubmit)} disabled={isPending}>
              <Tooltip title="Enregistrer" placement="left">
                <CheckCircleIcon />
              </Tooltip>
            </IconButton>
            <IconButton color="warning" onClick={() => setModification(false)} disabled={isPending}>
              <Tooltip title="Annuler" placement="left">
                <CloseIcon />
              </Tooltip>
            </IconButton>
          </Stack>
        </Box>
      )
    }
  }

  return (
    <Box>
      <FormControl fullWidth sx={{ pr: 1 }}>
        <SelectionProduit />
        <ModificationProduit />
      </FormControl>
    </Box>
  )
}

export default Produits