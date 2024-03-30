import React from "react";
import { styled } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import Settings from "./Settings";

type MenuProps = {
  open?: boolean;
  drawerwidth: number;
  onToggleDrawer: () => void;
};

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
  drawerwidth: number;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open, drawerwidth }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerwidth,
    width: `calc(100% - ${drawerwidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Menu = ({ open, drawerwidth, onToggleDrawer }: MenuProps) => {
  return (
    <AppBar position="absolute" open={open} drawerwidth={drawerwidth}>
      <Toolbar sx={{ pr: "24px" }}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={onToggleDrawer}
          sx={{
            marginRight: "36px",
            ...(open && { display: "none" }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
          Formulaire Qualification
        </Typography>
        <Settings />
      </Toolbar>
    </AppBar>
  );
};

export default Menu;
