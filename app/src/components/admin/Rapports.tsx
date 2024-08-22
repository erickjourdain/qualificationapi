import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import React from "react";

const Rapports = () => {

  // Téléchargement du fichier rapport
  const handleDownload = async () => {
    const report = await fetch("/assets/rapport tripetto.docx")
      .then((res) =>
        res.blob().then(blob => {
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement('a');
          a.href = url;
          a.download = 'rapport tripetto.docx';
          a.click();
        }));
  }

  return (
    <Paper>
      <Box px={3} py={2}>
        <Typography variant="h5" gutterBottom>
          Rapports
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button 
            startIcon={<DownloadIcon />} 
            variant="contained" 
            color="primary"
            onClick={handleDownload}
          >
            Télécharger rapport actuel
          </Button>
          <Button 
            startIcon={<FileUploadIcon />} 
            variant="contained" 
            color="primary"
          >
            Charger nouveau rapport
          </Button>
        </Stack>
      </Box>
    </Paper>
  )
}

export default Rapports;