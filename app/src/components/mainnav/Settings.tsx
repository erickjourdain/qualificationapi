import { useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { IconButton, Tooltip } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

const Settings = () => {

  // Chargement du Hook de navigation
  const navigate = useNavigate();

  // Navigation vers la page d'administration
  const handleClick = useCallback(() => {
    navigate({ to: "/admin/formulaires" });
  }, []);

  return (
    <Tooltip title="administration l'application">
      <IconButton
        size="large"
        aria-label="quitter"
        onClick={handleClick}
        color="inherit"
      >
        <SettingsIcon />
      </IconButton>
    </Tooltip>
  );
};

export default Settings;
