import { useNavigate } from "@tanstack/react-router";
import { Box, Button, Typography } from "@mui/material";
import { purple } from "@mui/material/colors";

const primary = purple[500]; // #f44336

export default function NotFound() {
  const navigate = useNavigate();

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
      <Typography variant="h1" style={{ color: "white" }}>
        404
      </Typography>
      <Typography variant="h6" style={{ color: "white" }}>
        La page recherchée n'existe pas.
      </Typography>
      <Button variant="contained" onClick={() => navigate({ to: "/" })}>
        Retour page d'accueil
      </Button>
    </Box>
  );
}
