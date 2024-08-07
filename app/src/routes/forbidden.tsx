import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Box, Button, Typography } from "@mui/material";
import { purple } from "@mui/material/colors";

export const Route = createFileRoute("/forbidden")({
  component: Forbidden,
});

function Forbidden() {
  // Hook de navigation
  const navigate = useNavigate();

  // Définition couleur du fond
  const primary = purple[500]; // #f44336

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: primary,
        padding: "10px",
      }}
    >
      <Typography variant="h3" style={{ color: "white" }}>
        Erreur 403
      </Typography>
      <Typography variant="h6" style={{ color: "white" }}>
        Vous ne disposez pas des droits pour accéder à cette page.
      </Typography>
      <Button variant="contained" onClick={() => navigate({ to: "/" })}>
        Retour page d'accueil
      </Button>
    </Box>
  );
}
