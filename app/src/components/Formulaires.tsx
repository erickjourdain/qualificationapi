import { useNavigate } from "@tanstack/react-router";
import { Box, Paper, TablePagination, Typography } from "@mui/material";
import TableFormulaires from "@components/TableFormulaires";
import { Route } from "@routes/_mainLayout/formulaires";
import { FormAPI } from "@/gec-tripetto";

const Formulaires = () => {
  // Nombre de lignes par page du tableau
  const itemsPerPage = 10;

  // Hook de navigation
  const navigate = useNavigate();
  // Hook des paramètres de recherche de la page
  const { page } = Route.useSearch();
  // Hook des données du loader de la page
  const formulaires = Route.useLoaderData();

  // Sélcetion d'un formulaires
  const handleSelect = (_form: FormAPI) => {} 

  return (
    <Paper>
      <Box px={3} py={2}>
        <Typography variant="h5" gutterBottom>
          Liste des Formulaires disponibles
        </Typography>
        <TableFormulaires formulaires={formulaires.data} onSelect={handleSelect} />
        <TablePagination
          rowsPerPageOptions={[itemsPerPage]}
          component="div"
          count={formulaires.nbElements}
          rowsPerPage={itemsPerPage}
          page={(page !== undefined) ? page-1 : 0}
          onPageChange={(_evt, newPage) => navigate({ search: (prev) => ({ ...prev, page: newPage+1 }) })}
        />
      </Box>
    </Paper>
  )
}

export default Formulaires;