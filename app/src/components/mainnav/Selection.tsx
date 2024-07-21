import { Box } from "@mui/material";
import Formulaires from "./Formulaires";
import Theme from "./Theme";
import Settings from "./Settings";
import Quitter from "./Quitter";
import Runner from "./Runner";

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