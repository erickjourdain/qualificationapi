import React, { ReactElement, useEffect } from "react";
import { useForm } from "react-hook-form";
import Box from "@mui/material/Box";

type Inputs = {
  societe: string;
  email: string;
  telephone: string;
  nom: string;
  prenom: string;
  opportunite: string;
  projet: string;
}

interface HeaderFormProps {
  defaultValues: Inputs;
  children: React.JSX.Element[];
  onSubmit: (data: any) => void;
  onChange: (isDirty: boolean) => void;
}

const HeaderForm = ({ defaultValues, children, onSubmit, onChange }: HeaderFormProps) => {

  // Hook de gestion du formulaire
  const { handleSubmit, formState, register } = useForm<Inputs>({ defaultValues });

  // Mise à jour de l'état du formulaire
  useEffect(() => {
    onChange(formState.isDirty);
  }, [formState]);

  return (
    <Box
      component="form"
      sx={{
        "& .header-input": { m: 1, width: "30%" }
      }}
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off">
      {React.Children.map(children, (child: React.JSX.Element) => {
        if (child.props.name) {
          switch (child.props.name) {
            case "save":
            case "reset":
              return React.createElement(child.type, {
                ...{
                  ...child.props,
                  key: child.props.name,
                }
              });
            default:
              return React.createElement(child.type, {
                ...{
                  ...child.props,
                  register,
                  key: child.props.name,
                  errors: formState.errors,
                }
              });
          }
        } else {
          return child;
        }
      })}
    </Box>
  )
}

export default HeaderForm;