import React from "react";
import { useState, MouseEvent } from "react";
import { useNavigate } from "react-router";
import { useAtom } from "jotai";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from '@mui/icons-material/Logout';
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import SettingsIcon from "@mui/icons-material/Settings";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import DoneIcon from '@mui/icons-material/Done';
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

  const handleNavigForm = () => {
    handleClose();
    navigate("/formulaires");
  }

  const handleNavigDoc = () => {
    handleClose();
    const url = new URL(window.location.href);
    window.open(`${url.protocol}//${url.host}/assets/documentation.pdf`, "documentation", "popup");
  }

  const handleNavigAdmin = () => {
    handleClose();
    navigate("/admin");
  }

  const handleNavigClose = () => {
    handleClose();
    navigate("/close");
  }

  return (
    <Box sx={{ display: { xs: "none", sm: "block" } }}>
      <IconButton
        size="large"
        aria-label="formulaires"
        color="inherit"
        onClick={handleNavigForm}
      >
        <ReceiptLongIcon />
      </IconButton>
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
              {
                (value === tripettoRunner) && <DoneIcon />
              }
            </MenuItem>
          );
        })}
        <Divider key="divider-1"/>
        <MenuItem key="documentation" onClick={handleNavigDoc}>Documentation</MenuItem>
        {isAdmin() &&
          [
            <Divider key="divider-2" />,
            <MenuItem key="admin" onClick={handleNavigAdmin}>Administration</MenuItem>
          ]
        }
      </Menu>
      <IconButton color="inherit" onClick={handleNavigClose}><LogoutIcon /></IconButton>
    </Box>
  );
};

export default Settings;
