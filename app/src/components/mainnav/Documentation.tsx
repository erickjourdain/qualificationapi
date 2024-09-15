import { useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { IconButton, Tooltip } from "@mui/material";
import ImportContactsIcon from '@mui/icons-material/ImportContacts';

const Documentation = () => {

  // Chargement du Hook de navigation
  const navigate = useNavigate();

  // Navigation vers la page "/formulaires"
  const handleClick = useCallback(() => {
    navigate({ to: "/documentation" });
  }, [navigate]);

  return (
    <Tooltip title="documentation">
      <IconButton
        size="large"
        aria-label="documentation"
        color="inherit"
        onClick={handleClick}
      >
        <ImportContactsIcon />
      </IconButton>
    </Tooltip>
  )
}

export default Documentation;
