import React from "react"
import Formulaire from "../components/headers/Formulaire"
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const AddHeader = () => {
  return (
    <Paper
      sx={{
        marginTop: "10px",
      }}
    >
      <Box px={3} py={2}>
        <Typography variant="h6" sx={{ m: 2 }}>
          Nouvelle Oppportunité
        </Typography>
        <Formulaire />
      </Box>
    </Paper>
  )
}

export default AddHeader;