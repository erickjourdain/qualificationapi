import React from "react";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";

const CloseApp = () => {
  const navigate = useNavigate();

  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignContent: "center",
          justifyContent: "center",
          height: "75vh",
        }}
      >
        <Typography sx={{ mb: 3, textAlign: "center" }} variant="h5">
          L'application est fermée, cliquez sur le bouton ci-dessous pour la relancer.
        </Typography>
        <Button color="primary" variant="contained" onClick={() => navigate("/")}>
          Relancer l'application
        </Button>
      </Box>
    </Container>
  )
}

export default CloseApp;