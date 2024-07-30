import { Box } from "@mui/material";
import Formulaires from "@components/mainnav/Formulaires";
import Theme from "@components/mainnav/Theme";
import Settings from "@components/mainnav/Settings";
import Quitter from "@components/mainnav/Quitter";
import Runner from "@components/mainnav/Runner";
import { includes } from "lodash";
import { useLocation, useRouteContext } from "@tanstack/react-router";
import { useEffect } from "react";

const Selection = () => {

  const location = useLocation();
  const context = useRouteContext({ from: "/_mainLayout" });

  useEffect(() => {
    console.log(location);
  }, []);

  return(
    <Box sx={{ display: { xs: "none", sm: "block" } }}>
      { context && context.user && <Formulaires /> }
      <Theme />
      <Runner />
      { context && context.user && includes(["ADMIN", "READER"], context.user.role) && <Settings /> }
      <Quitter />
    </Box>
  )
}

export default Selection;