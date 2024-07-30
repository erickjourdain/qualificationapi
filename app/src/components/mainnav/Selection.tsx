import { Box } from "@mui/material";
import Formulaires from "@components/mainnav/Formulaires";
import Theme from "@components/mainnav/Theme";
import Settings from "@components/mainnav/Settings";
import Quitter from "@components/mainnav/Quitter";
import Runner from "@components/mainnav/Runner";
import { useAuth } from "@/hooks/auth";

const Selection = () => {

  const auth = useAuth();

  return(
    <Box sx={{ display: { xs: "none", sm: "block" } }}>
      { auth.isLogged && <Formulaires /> }
      <Theme />
      <Runner />
      { auth.isCreator && <Settings /> }
      <Quitter />
    </Box>
  )
}

export default Selection;