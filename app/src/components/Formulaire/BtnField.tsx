import React from "react"
import { Button } from "@mui/material";

interface InputFieldProps {
  [x: string]: any,
}

const BtnField = ({label, ...rest}: InputFieldProps) => {
  return <Button {...rest} variant="contained">{label}</Button>
}

export default BtnField;