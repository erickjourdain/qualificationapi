import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { Box, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, ListSubheader, Toolbar } from '@mui/material'
import FeedIcon from "@mui/icons-material/Feed";
import PersonIcon from "@mui/icons-material/Person";

export const Route = createFileRoute('/_mainLayout/_adminLayout')({
  component: AdminLayout,
})

function AdminLayout() {
  const drawerWidth = 200;

  const navigate = useNavigate();

  const formulaires = () => {
    navigate({ to: "/admin/formulaires" });
  }

  const utilisateurs = () => {
    navigate({ to: "/admin/utilisateurs" });
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
            <ListItem key="form" onClick={formulaires}>
              <ListItemIcon>
                <FeedIcon />
              </ListItemIcon>
              <ListItemText primary="Formulaires" />
            </ListItem>
            <ListItem key="user" onClick={utilisateurs}>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Utilisateurs" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, maxWidth: "xl", ml: `${drawerWidth}px` }}>
        <Outlet />
      </Box>
    </>
  )
}
