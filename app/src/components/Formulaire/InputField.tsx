import React from "react";
import TextField from "@mui/material/TextField";

interface InputFieldProps {
  [x: string]: any,
}

export const InputField = ({ register, name, rules, errors, ...rest }: InputFieldProps) => {
  return <TextField 
    {...register(name, rules)} 
    {...rest}
    error={errors[name] ? true : false}
    helperText={errors[name]?.message}
  />
}