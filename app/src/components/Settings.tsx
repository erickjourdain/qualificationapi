import React from "react";
import { useState, MouseEvent } from "react";
import { useNavigate } from "react-router";
import { useAtom } from "jotai";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import IconButton from "@mui/material/IconButton";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import SettingsIcon from "@mui/icons-material/Settings";
import { selectedRunner } from "../atomState";
import { isAdmin } from "../utils/auth";
import { Runner } from "../gec-tripetto";


const options = ["Classic", "Autoscroll", "Chat"];

const Settings = () => {
  // Chargement de l'état Atom du runner
  const [tripettoRunner, setTripettoRunner] = useAtom(selectedRunner);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClick = (i: number) => {
    setTripettoRunner(options[i] as Runner);
    localStorage.setItem("runner", options[i]);
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: { xs: "none", sm: "block" } }}>
      {tripettoRunner}
      <IconButton
        size="large"
        aria-label="paramètres"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <SettingsIcon />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {options.map((value, ind) => {
          return (
            <MenuItem onClick={() => handleClick(ind)} key={ind}>
              {value}
            </MenuItem>
          );
        })}
        {isAdmin() &&
          [
            <Divider key="divider" />,
            <MenuItem key="admin" onClick={() => navigate("/admin")}>Administration</MenuItem>
          ]
        }
      </Menu>
      <IconButton color="inherit" onClick={() => navigate("/close")}><ExitToAppIcon /></IconButton>
    </Box>
  );
};

export default Settings;
