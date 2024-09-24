import { useCallback } from "react";
import { IconButton, Tooltip } from "@mui/material";
import ImportContactsIcon from '@mui/icons-material/ImportContacts';

const Documentation = () => {

  // Navigation vers la page "/formulaires"
  const handleClick = useCallback(() => {
    const url = new URL(window.location.href);
    window.open(`${url.protocol}//${url.host}/assets/documentation.pdf`, "documentation", "popup");
  }, []);

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
