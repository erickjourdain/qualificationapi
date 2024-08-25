import React, { ChangeEvent, ChangeEventHandler, useState } from "react";
import { Box, Button, Paper, Stack, styled, Typography } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { getReport, uploadReport } from "../../utils/apiCall";
import { useSetAtom } from "jotai";
import { displayAlert } from "../../atomState";
import manageError from "../../utils/manageError";

const Rapports = () => {

  // Etat Atom de gestion des alertes
  const setAlerte = useSetAtom(displayAlert);

  // Etat local téléchargement du fichier
  const [loading, setLoading] = useState<boolean>(false);

  // Téléchargement du fichier rapport
  const handleDownload = async () => {
    const rapport = await getReport();
    console.log(rapport.data);

    const blob = new Blob([rapport.data], 
      { type : "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
    let url = window.URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'rapport tripetto.docx';
    a.click();
    window.URL.revokeObjectURL(url);

    /*
        const report = await fetch("/assets/rapport tripetto.docx")
          .then((res) =>
            res.blob().then(blob => {
              let url = window.URL.createObjectURL(blob);
              let a = document.createElement('a');
              a.href = url;
              a.download = 'rapport tripetto.docx';
              a.click();
            }));
        */
  }

  // Chargement du fichier sur le serveur
  const handleUpload = async (evt: ChangeEvent<HTMLInputElement>) => {
    if (evt.target.files) {
      try {
        setLoading(true);
        await uploadReport(evt.target.files[0]);
        setLoading(false);
        setAlerte({ severite: "success", message: "le fichier a été mis à jour sur le serveur" });
      } catch (e) {
        setLoading(false);
        setAlerte({ severite: "error", message: manageError(e) });
      }
    }
  }

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

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
            disabled={loading}
          >
            Télécharger rapport actuel
          </Button>
          <Button
            component="label"
            startIcon={<FileUploadIcon />}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            <VisuallyHiddenInput type="file" onChange={handleUpload} accept=".docx,.docxm" />
            Charger nouveau rapport
          </Button>
        </Stack>
      </Box>
    </Paper>
  )
}

export default Rapports;