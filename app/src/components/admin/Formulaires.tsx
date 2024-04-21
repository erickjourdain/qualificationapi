import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSetAtom } from "jotai";
import { useQuery } from "@tanstack/react-query";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableBody from "@mui/material/TableBody";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { getForms } from "../../utils/apiCall";
import manageError from "../../utils/manageError";
import { displayAlert } from "../../atomState";
import { Form } from "../../gec-tripetto";
import { formatDateTime } from "../../utils/format";

const Formulaires = () => {

  const itemsPerPage = 5;
  const navigate = useNavigate();

  // Chargement de l'état Atom des alertes
  const setAlerte = useSetAtom(displayAlert);

  // State: page du tableau
  const [page, setPage] = useState(0);
  // State: formulaires
  const [formulaires, serFormulaires] = useState<Form[]>([]);
  // State: nombre formulaires
  const [nbFormulaires, setNbFormulaires] = useState<number>(0);

  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["getForms", page],
    queryFn: () => getForms(null, page, ["id", "titre", "version", "createur", "updatedAt", "slug"], itemsPerPage),
  })

  useEffect(() => {
    serFormulaires(data?.data.data);
    setNbFormulaires(data?.data.nombreFormulaires);
  }, [data]);

  // gestion des erreurs de chargement des données
  useEffect(() => {
    if (isError) setAlerte({ severite: "error", message: manageError(error) });
  }, [isError]);

  // Gestion du changement de page du tableau de résultat
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  if (isLoading)
    return (
      <>
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
      </>
    );

  if (formulaires) return (
    <Paper
      sx={{
        marginTop: "10px",
      }}
    >
      <Box sx={{ minWidth: 400, maxWidth: "80%", margin: "auto" }}>
        <Typography variant="h5" gutterBottom>
          Formulaires
        </Typography>
        <Button color="primary" variant="contained" startIcon={<AddCircleIcon />} onClick={() => navigate({ pathname: "form/ajouter" })}>
          Nouveau Formulaire
        </Button>
        <Table aria-label="table-users">
          <TableHead>
            <TableRow>
              <TableCell>Voir</TableCell>
              <TableCell>Titre</TableCell>
              <TableCell>Version</TableCell>
              <TableCell>Mise à jour</TableCell>
              <TableCell>Créateur</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formulaires.map((form) => (
              <TableRow key={form.id}>
                <TableCell>
                  <VisibilityIcon sx={{ cursor: "pointer" }} onClick={() => navigate({ pathname: `form/${form.slug}` })} />
                </TableCell>
                <TableCell>{form.titre}</TableCell>
                <TableCell>{form.version}</TableCell>
                <TableCell>{formatDateTime(form.updatedAt)}</TableCell>
                <TableCell>{form.createur?.nom}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[itemsPerPage]}
          component="div"
          count={nbFormulaires}
          rowsPerPage={itemsPerPage}
          page={page}
          onPageChange={handleChangePage}
        />
      </Box>
    </Paper>
  )
}

export default Formulaires;