import { useCallback } from "react";
import { useAtomValue } from "jotai";
import { useNavigate } from "@tanstack/react-router";
import { IconButton, Tooltip } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { creatorAtom} from "../../stores/mainStore";

const Settings = () => {
  // Chargement de l'état du rôle Créateur de l'utilisateur
  const isCreator = useAtomValue(creatorAtom);

    // Chargement du Hook de navigation
  const navigate = useNavigate();

  // Navigation vers la page d'administration
  const handleClick = useCallback(() => {
    navigate({ to: "/admin/formulaires" });
  }, []);

  if (!isCreator) return <></>

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
