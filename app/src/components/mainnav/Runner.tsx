import { useCallback, useState, MouseEvent } from "react";
import { useAtom } from "jotai";
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip } from "@mui/material";
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay';
import CkeckIcon from "@mui/icons-material/Check";
import { runnerAtom } from "@/stores/mainStore";

const runners = ["Classic", "Autoscroll", "Chat"];

const Runner = () => {

  // Chargement de l'état Atom du runner Tripetto
  const [runner, setRunner] = useAtom(runnerAtom);

  // Etat interne sur l'ouverture du menu déroulant
  const [open, setOpen] = useState<null | HTMLElement>(null);

  // Changement état du ménu déroulant
  const handleMenu = useCallback((event: MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  }, []);

  // Fermeture du menu déroulant
  const handleClose = useCallback(() => {
    setOpen(null);
  }, []);

  // Sélection du mode
  const handleRunner = useCallback((runner: string) => {
    setRunner(runner);
    handleClose();
  }, []);

  return (
    <>
      <Tooltip title="présentation formulaire">
        <IconButton
          size="large"
          aria-label="theme"
          color="inherit"
          onClick={handleMenu}
        >
          <SmartDisplayIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id="menu-appbar"
        anchorEl={open}
        keepMounted
        open={Boolean(open)}
        onClose={handleClose}
      >
        {runners.map((value) => {
          return (
            <MenuItem onClick={() => handleRunner(value)} key={value}>
              {
                (value === runner) &&
                <ListItemIcon>
                  <CkeckIcon />
                </ListItemIcon>
              }
              <ListItemText inset={value !== runner}>
                {value}
              </ListItemText>
            </MenuItem>
          );
        })}
      </Menu >
    </>
  )
}

export default Runner;