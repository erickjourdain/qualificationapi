import { useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { IconButton, Tooltip } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

const Quitter = () => {
  // Chargement du Hook de navigation
  const navigate = useNavigate();

  // Navigation vers la page "/close"
  const handleClick = useCallback(() => {
    navigate({ to: "/close" });
  }, []);

  return (
    <Tooltip title="fermer l'application">
      <IconButton
        size="large"
        aria-label="quitter"
        onClick={handleClick}
        color="inherit"
      >
        <LogoutIcon />
      </IconButton>
    </Tooltip>
  );
};

export default Quitter;
