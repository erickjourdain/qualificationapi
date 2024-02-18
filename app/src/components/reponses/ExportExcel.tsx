import React from "react";
import Fab from "@mui/material/Fab";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useParams } from "react-router";
import exportResults from "../../utils/exportResults";

const ExportExcel = () => {
  const { uuid } = useParams();

  const onClick = async () => {
    if (uuid) await exportResults(uuid);
  }

  return (
    <Fab color="primary" variant="extended" aria-label="export-excel" onClick={onClick}>
      <FileDownloadIcon sx={{ mr: 1 }} />
      Excel
    </Fab>
  );
}

export default ExportExcel;
