import { useEffect, useState } from "react";
import { useSetAtom } from "jotai";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import Button from "@mui/material/Button";
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
import Loading from "../Loading";

interface FormulairesProps {
  admin: boolean;
}

const Formulaires = ({ admin }: FormulairesProps) => {

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

  // Sélcetion d'un formulaires
  const handleSelect = (form: FormAPI) => {
    if (admin) navigate({ to: `/admin/formulaires/${form.slug}` })
  }

  if (isLoading) return <Loading />;

  if (formulaires) return (
    <Paper>
      <Box px={3} py={2}>
        <Typography variant="h5" gutterBottom>
          Liste des Formulaires disponibles
        </Typography>
        {
          admin &&
          <Button color="primary" variant="contained" startIcon={<AddCircleIcon />} onClick={() => navigate({ to: "/admin/formulaires/ajouter" })}>
            Nouveau Formulaire
          </Button>
        }
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
              <TableRow key={form.id} onDoubleClick={() => handleSelect(form)} sx={{ cursor: "pointer" }}>
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