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
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { getForms } from "../../utils/apiCall";
import manageError from "../../utils/manageError";
import { displayAlert } from "../../atomState";
import { FormAPI, FormsAPI } from "../../gec-tripetto";
import { formatDateTime } from "../../utils/format";

const Formulaires = () => {

  const itemsPerPage = 10;
  const navigate = useNavigate();

  // Chargement de l'état Atom des alertes
  const setAlerte = useSetAtom(displayAlert);

  // State: page du tableau
  const [page, setPage] = useState(0);
  // State: formulaires
  const [formulaires, setFormulaires] = useState<FormAPI[]>([]);
  // State: nombre formulaires
  const [nbFormulaires, setNbFormulaires] = useState<number>(0);

  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["getForms", page],
    queryFn: () => getForms(null, page + 1, ["id", "titre", "version", "createur", "updatedAt", "slug"], itemsPerPage),
    select: (response) => response.data as FormsAPI, 
  })

  useEffect(() => {
    if (data) {
      setFormulaires(data?.data);
      setNbFormulaires(data?.nbElements);
    }
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
    <Paper>
      <Box px={3} py={2}>
        <Typography variant="h5" gutterBottom>
          Formulaires
        </Typography>
        <Button color="primary" variant="contained" startIcon={<AddCircleIcon />} onClick={() => navigate({ pathname: "form/ajouter" })}>
          Nouveau Formulaire
        </Button>
        <Table aria-label="table-users">
          <TableHead>
            <TableRow>
              <TableCell>Titre</TableCell>
              <TableCell>Version</TableCell>
              <TableCell>Mise à jour</TableCell>
              <TableCell>Créateur</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formulaires.map((form) => (
              <TableRow key={form.id} onDoubleClick={() => navigate({ pathname: `form/${form.slug}` })} sx={{ cursor: "pointer"}}>
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