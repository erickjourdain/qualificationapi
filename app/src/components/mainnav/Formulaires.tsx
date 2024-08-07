import { useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { IconButton, Tooltip } from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

const Formulaires = () => {
  // Chargement du Hook de navigation
  const navigate = useNavigate();

  // Navigation vers la page "/formulaires"
  const handleClick = useCallback(() => {
    navigate({ to: "/formulaires" });
  }, []);

  return (
    <Tooltip title="liste des formulaires">
      <IconButton
        size="large"
        aria-label="formulaires"
        onClick={handleClick}
        color="inherit"
      >
        <ReceiptLongIcon />
      </IconButton>
    </Tooltip>
  );
};

export default Formulaires;
