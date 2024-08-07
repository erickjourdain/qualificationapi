import { AxiosResponse } from "axios";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Role, User } from "@/gec-tripetto";
import { updateUser } from "@/utils/apiCall";
import manageError from "@/utils/manageError";
import { alertAtom } from "@/stores/mainStore";

type IFormInputs = {
  prenom: string;
  nom: string;
  login: string;
  role: Role;
  validated: boolean;
  locked: boolean;
};

type UpdateFormProps = {
  user: User;
  onUpdated: (newUser: User) => void;
};

const UtilisateurForm = ({ user, onUpdated }: UpdateFormProps) => {
  const roles = ["ADMIN", "CREATOR", "USER", "READER"];

  // Chargement de l'état Atom des alertes
  const setAlerte = useSetAtom(alertAtom);

  // Définition des éléments pour la validation du formulaire
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<IFormInputs>({
    defaultValues: {
      prenom: user.prenom,
      nom: user.nom,
      login: user.login,
      role: user.role,
      locked: user.locked,
      validated: user.validated,
    },
  });

  useEffect(() => {
    reset({
      prenom: user.prenom,
      nom: user.nom,
      login: user.login,
      role: user.role,
      locked: user.locked,
      validated: user.validated,
    });
  }, [user]);

  const { mutate, isPending } = useMutation({
    mutationFn: updateUser,
    onSuccess: (rep: AxiosResponse) => {
      setAlerte({
        severite: "success",
        message: "Les données ont été mises à jour",
      });
      onUpdated(rep.data);
    },
    onError: (error: Error) => {
      setAlerte({ severite: "error", message: manageError(error) });
    },
  });

  const onSubmit = (data: IFormInputs) => {
    mutate({
      ...data,
      id: user.id,
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="space-around"
        sx={{
          mt: 2,
          "& .MuiTextField-root": { flex: "0 0 30%", m: 1 },
          "& .MuiFormControlLabel-root": { flex: "0 0 30%", m: 1 },
        }}
      >
        <TextField
          id="nom"
          label="nom"
          {...register("nom", {
            required: "Le nom est obligatoire",
          })}
          error={errors.nom ? true : false}
        />
        <Typography variant="inherit" color="error">
          {errors.nom?.message}
        </Typography>
        <TextField
          id="prenom"
          label="prenom"
          {...register("prenom", {
            required: "Le prenom est obligatoire",
          })}
          error={errors.prenom ? true : false}
        />
        <Typography variant="inherit" color="error">
          {errors.prenom?.message}
        </Typography>
        <TextField
          id="login"
          label="login"
          {...register("login", {
            required: "Le login est obligatoire",
          })}
          error={errors.login ? true : false}
        />
        <Typography variant="inherit" color="error">
          {errors.login?.message}
        </Typography>
        <Box sx={{ width: "30%" }}>
          <FormControl fullWidth>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <>
                  <InputLabel id="role-select-label">role</InputLabel>
                  <Select
                    id="role-select"
                    labelId="role-select-label"
                    label="role"
                    {...field}
                  >
                    {roles.map((r) => (
                      <MenuItem value={r} key={r}>
                        {r}
                      </MenuItem>
                    ))}
                  </Select>
                </>
              )}
            />
          </FormControl>
        </Box>
        <Controller
          name="validated"
          control={control}
          render={({ field: { value, onChange } }) => (
            <FormControlLabel
              control={<Switch checked={value} onChange={onChange} />}
              label="validé"
            />
          )}
        />
        <Controller
          name="locked"
          control={control}
          render={({ field: { value, onChange } }) => (
            <FormControlLabel
              control={<Switch checked={value} onChange={onChange} />}
              label="bloqué"
            />
          )}
        />
      </Box>
      <Box mt={3} display="flex" alignItems="flex-start">
        <Stack spacing={2} direction="row">
          <Button
            variant="contained"
            color="primary"
            disabled={isPending}
            type="submit"
          >
            {!isPending ? "Mettre à jour" : "Loading..."}
          </Button>
          <Button
            variant="contained"
            color="warning"
            disabled={isPending}
            onClick={() => reset()}
          >
            Reset
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default UtilisateurForm;
