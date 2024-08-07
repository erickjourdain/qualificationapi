import { useCallback, useState, MouseEvent } from "react";
import { useAtom } from "jotai";
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import CkeckIcon from "@mui/icons-material/Check";
import { modeAtom } from "@/stores/mainStore";

interface Theme {
  mode: "light" | "dark";
}

const Theme = () => {
  // Chargement de l'état Atom du theme
  const [mode, setMode] = useAtom(modeAtom);

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
  const handleTheme = useCallback(({ mode }: Theme) => {
    setMode(mode);
    handleClose();
  }, []);

  return (
    <>
      <Tooltip title="thème de l'application">
        <IconButton
          size="large"
          aria-label="theme"
          color="inherit"
          onClick={handleMenu}
        >
          {mode === "light" ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Tooltip>
      <Menu
        id="menu-appbar"
        anchorEl={open}
        keepMounted
        open={Boolean(open)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleTheme({ mode: "light" })} key="light">
          <>
            {mode !== "dark" && (
              <ListItemIcon>
                <CkeckIcon />
              </ListItemIcon>
            )}
            <ListItemText inset={mode === "dark"}>clair</ListItemText>
          </>
        </MenuItem>
        <MenuItem onClick={() => handleTheme({ mode: "dark" })} key="dark">
          <>
            {mode === "dark" && (
              <ListItemIcon>
                <CkeckIcon />
              </ListItemIcon>
            )}
            <ListItemText inset={mode !== "dark"}>sombre</ListItemText>
          </>
        </MenuItem>
      </Menu>
    </>
  );
};

export default Theme;
