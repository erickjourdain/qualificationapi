import { createFileRoute, Outlet, redirect, useNavigate } from '@tanstack/react-router';
import { Box, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, ListSubheader, Toolbar } from '@mui/material'
import FeedIcon from "@mui/icons-material/Feed";
import PersonIcon from "@mui/icons-material/Person";
import { useAuth } from '@/hooks/auth';

export const Route = createFileRoute('/_mainLayout/_auth/_adminLayout')({
  beforeLoad: ({ context }) => {
    if (!context.auth.isCreator) throw redirect({ to: "/forbidden" });
  },
  component: AdminLayout,
})

function AdminLayout() {

  const auth = useAuth();

  // Largeur de la barre latérale
  const drawerWidth = 200;

  // Hook de navigation
  const navigate = useNavigate();

  // Navigation vers la gestion des formulaires
  const handleFormulairesClick = () => {
    navigate({ to: "/admin/formulaires" });
  }

  // Navigation vers la gestion des utilisateurs
  const handleUtilisateursClick = () => {
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
            <ListItem key="form" onClick={handleFormulairesClick}>
              <ListItemIcon>
                <FeedIcon />
              </ListItemIcon>
              <ListItemText primary="Formulaires" />
            </ListItem>
            {auth.isAdmin &&
              <ListItem key="user" onClick={handleUtilisateursClick}>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Utilisateurs" />
              </ListItem>
            }
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, maxWidth: "xl", ml: `${drawerWidth}px` }}>
        <Outlet />
      </Box>
    </>
  )
}
