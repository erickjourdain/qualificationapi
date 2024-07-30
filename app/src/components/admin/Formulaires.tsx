import { useNavigate, useRouteContext } from "@tanstack/react-router";
import { includes } from "lodash";
import { Box, Button, Paper, TablePagination, Typography } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Route } from "@/routes/_mainLayout/_auth/_adminLayout/admin/formulaires"
import { FormAPI } from "@/gec-tripetto";
import TableFormulaires from "@components/TableFormulaires"

const Formulaires = () => {
  // Nombre de lignes par page du tableau
  const itemsPerPage = 10;

  // Hook de récupération du context de la route
  const context = useRouteContext({ from: "/_mainLayout/_auth" });
  // Hook de navigation
  const navigate = useNavigate();
  // Hook des paramètres de recherche de la page
  const { page } = Route.useSearch();
  // Hook des données du loader de la page
  const formulaires = Route.useLoaderData()

  // Sélection d'un formulaires
  const handleSelect = (form: FormAPI) => {
    if (context.user && includes(["ADMIN", "CREATOR"], context.user.role))  
      navigate({ to: `/admin/formulaires/${form.slug}` })
  }

  return (
    <Paper>
      <Box px={3} py={2}>
        <Typography variant="h5" gutterBottom>
          Liste des Formulaires disponibles
        </Typography>
          <Button color="primary" variant="contained" startIcon={<AddCircleIcon />} onClick={() => navigate({ to: "/admin/formulaires/ajouter" })}>
            Nouveau Formulaire
          </Button>
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