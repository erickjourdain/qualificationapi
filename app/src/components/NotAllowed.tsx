import React from "react";
import Alert from "@mui/material/Alert";

const NotAllowed = () => {
  return (
    <Alert sx={{ m: 3 }} color="warning">
      Vous n'êtes pas autorisé à accèder à cette page
    </Alert>
  );
};

export default NotAllowed;
