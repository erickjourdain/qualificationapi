import React, { useState } from "react";
import { Outlet, useLocation, useNavigate, useOutletContext } from "react-router";
import { useAtomValue } from "jotai";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import FeedIcon from "@mui/icons-material/Feed";
import PersonIcon from "@mui/icons-material/Person";
import SummarizeIcon from '@mui/icons-material/Summarize';
import Divider from "@mui/material/Divider";
import ListSubheader from "@mui/material/ListSubheader";
import Alert from "@mui/material/Alert";
import GeneralLayout from "./GeneralLayout";
import { environnementInfo } from "../atomState";

type typeMenu = "formulaires" | "utilisateurs" | "rapports";
type typeContext = { menu: typeMenu };

const AdminLayout = () => {
  // Larguer du menu latéral
  const drawerWidth = 200;

  const navigate = useNavigate();

  // Etat Atom de l'environnement de travail
  const info = useAtomValue(environnementInfo);

  // State: sélection de l'affichage
  const [selected, setSelected] = useState<typeMenu>("formulaires");

  // Sélection du menu
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
            <ListItem key="rapport" onClick={() => changedMenu("rapports")}>
              <ListItemIcon>
                <SummarizeIcon />
              </ListItemIcon>
              <ListItemText primary="Rapports" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, maxWidth: "xl", ml: `${drawerWidth}px` }}>
        {info && <Alert severity="warning" variant="filled" sx={{ mb: 2 }} >{info}</Alert>}
        <Outlet context={{ menu: selected } satisfies typeContext} />
      </Box>
      <GeneralLayout />
    </>
  )
}

export default AdminLayout;

export function useMenu() {
  return useOutletContext<typeContext>();
}