import React from "react";
import { Paper } from "@mui/material";

const Documentation = () => {
  return (
    <Paper sx={{ height: "800px" }}>
      <embed
        src="/documentation.pdf"
        type="application/pdf"
        width="100%"
        height="100%"
        title="documentation"
      />
    </Paper>
  )
}

export default Documentation;