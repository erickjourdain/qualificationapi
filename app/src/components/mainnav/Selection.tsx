import { Box } from "@mui/material";
import Formulaires from "@components/mainnav/Formulaires";
import Theme from "@components/mainnav/Theme";
import Settings from "@components/mainnav/Settings";
import Quitter from "@components/mainnav/Quitter";
import Runner from "@components/mainnav/Runner";

const Selection = () => {

  return(
    <Box sx={{ display: { xs: "none", sm: "block" } }}>
      <Formulaires />
      <Theme />
      <Runner />
      <Settings />
      <Quitter />
    </Box>
  )
}

export default Selection;