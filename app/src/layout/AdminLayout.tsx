import React, { useState } from "react";
import { Outlet, useNavigate, useOutletContext } from "react-router";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import FeedIcon from "@mui/icons-material/Feed";
import PersonIcon from "@mui/icons-material/Person";
import Divider from "@mui/material/Divider";
import ListSubheader from "@mui/material/ListSubheader";

type typeMenu = "formulaires" | "utilisateurs";
type typeContext = { menu: typeMenu };

const AdminLayout = () => {
  // Larguer du menu latéral
  const drawerWidth = 200;

  const navigate = useNavigate();

  const [selected, setSelected] = useState<typeMenu>("formulaires");

  const changedMenu = (menu: typeMenu) => {
    setSelected(menu);
    navigate("/admin");
  }

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto", cursor: "pointer" }}>
          <List subheader={<ListSubheader>Administration</ListSubheader>}>
            <Divider />
            <ListItem key="form" onClick={() => changedMenu("formulaires")}>
              <ListItemIcon>
                <FeedIcon />
              </ListItemIcon>
              <ListItemText primary="Formulaires" />
            </ListItem>
            <ListItem key="user" onClick={() => changedMenu("utilisateurs")}>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Utilisateurs" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3, maxWidth: "lg" }}>
        <Toolbar />
          <Outlet context={{ menu: selected } satisfies typeContext } />
        </Box>
    </>
  )
}

export default AdminLayout;

export function useMenu() {
  return useOutletContext<typeContext>();
}