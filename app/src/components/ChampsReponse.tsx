import React from "react";
import { isEmpty } from "lodash";
import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import { AnswerAPI } from "gec-tripetto";
import { formatDateTime } from "../utils/format";


interface ReturnValues {
  statut: string;
  demande: number | null;
  opportunite: number | null;
}

type ChampsReponseProps = {
  reponse: AnswerAPI;
  onUpdate: (values: ReturnValues, err: boolean) => void;
};

interface IformInput {
  gestionnaire: string;
  createdAt: string;
  updatedAt: string;
  statut: string;
  demande: number | null;
  opportunite: number | null;
}

const ChampsReponse = ({ reponse, onUpdate }: ChampsReponseProps) => {
  const statuts = ["BROUILLON", "QUALIFICATION", "DEVIS", "GAGNE", "PERDU"];

  // définition du hook pour la gestion du formulaire
  const {
    control,
    register,
    formState: { errors, isValid },
    getValues,
    setValue,
    trigger,
  } = useForm<IformInput>({
    mode: "all",
    defaultValues: {
      gestionnaire: `${reponse.gestionnaire.prenom} ${reponse.gestionnaire.nom}`,
      createdAt: formatDateTime(reponse.createdAt),
      updatedAt: formatDateTime(reponse.updatedAt),
      statut: reponse.statut,
      demande: reponse.demande,
      opportunite: reponse.opportunite,
    },
  });

  useEffect(() => {
    setValue("gestionnaire", `${reponse.gestionnaire.prenom} ${reponse.gestionnaire.nom}`);
    setValue("createdAt", formatDateTime(reponse.createdAt));
    setValue("updatedAt", formatDateTime(reponse.updatedAt));
    setValue("statut", reponse.statut);
    setValue("demande", reponse.demande);
    setValue("opportunite", reponse.opportunite);
  }, [reponse]);

  /*
  // mise à jour parent suite modification d'une entrée
  const watchData = watch(["statut", "demande", "opportunite"]);
  useEffect(() => {
    onUpdate(
      {
        statut: watchData[0],
        demande: isEmpty(watchData[1]) ? null : watchData[1],
        opportunite: isEmpty(watchData[2]) ? null : watchData[2],
      },
      !isEmpty(errors),
    );
  }, [watchData]);
  */

  return (
    <Box display="flex" flexWrap="wrap" justifyContent="space-around" sx={{ mt: 2, "& .MuiTextField-root": { flex: "0 0 30%", m: 1 } }}>
      <TextField id="gestionnaire" label="Gestionnaire" disabled {...register("gestionnaire")} />
      <TextField id="createdAt" label="Date creation" disabled {...register("createdAt")} />
      <TextField id="updateddAt" label="Date mise à jour" disabled {...register("updatedAt")} />
      <Box sx={{ width: "30%", m: 1 }}>
        <FormControl fullWidth>
          <Controller
            name="statut"
            control={control}
            render={({ field }) => (
              <>
                <InputLabel id="statut-select-label">Statut</InputLabel>
                <Select id="statut-select" labelId="statut-select-label" label="statut" {...field}>
                  {statuts.map((st) => (
                    <MenuItem value={st} key={st}>
                      {st}
                    </MenuItem>
                  ))}
                </Select>
              </>
            )}
          />
        </FormControl>
      </Box>
      <TextField
        id="demande"
        label="Demande"
        InputProps={{
          startAdornment: <InputAdornment position="start">DEM</InputAdornment>,
        }}
        {...register("demande", { pattern: { value: /^[0-9]{6,6}$/g, message: "La demande doit comporter 6 chiffres" } })}
        error={errors.demande ? true : false}
      />
      <TextField
        id="opportunite"
        label="Opportunité"
        InputProps={{
          startAdornment: <InputAdornment position="start">OPP</InputAdornment>,
        }}
        disabled={!reponse.courante}
        {...register("opportunite", {
          pattern: { value: /^[0-9]{6,6}$/g, message: "L'opportunité doit comporter 6 chiffres" },
          onChange() {
            trigger(),
            onUpdate({ demande: getValues("demande"), opportunite: getValues("opportunite"), statut: getValues("statut") }, !isValid);
          },
        })}
        error={errors.opportunite ? true : false}
      />
      <Typography variant="inherit" color="error" sx={{ width: "30%", m: 1 }}>
        {errors.statut?.message}
      </Typography>
      <Typography variant="inherit" color="error" sx={{ width: "30%", m: 1 }}>
        {errors.demande?.message}
      </Typography>
      <Typography variant="inherit" color="error" sx={{ width: "30%", m: 1 }}>
        {errors.opportunite?.message}
      </Typography>
    </Box>
  );
};

export default ChampsReponse;
