import { useNavigate } from "@tanstack/react-router";
import { IconButton, Toolbar, Typography } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import Selection from "@components/mainnav/Selection";

const MainNav = () => {
  // Chargement Hook de navigation
  const navigate = useNavigate();

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={() => navigate({ to: "/" })}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Qualification
        </Typography>
        <Selection />
      </Toolbar>
    </AppBar>
  );
};

export default MainNav;
