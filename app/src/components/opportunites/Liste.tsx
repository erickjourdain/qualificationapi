import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { Route } from "@/routes/_auth/opportunites/index";
import { formatDate } from "@/utils/format";
import { useAuth } from "@/hooks/auth";

const Liste = () => {
  // Nombre de lignes par page du tableau
  const itemsPerPage = 10;

  // Hook de Gestion des autorisations
  const auth = useAuth();
  // Hook de navigation
  const navigate = useNavigate();

  // Hook des paramètres de recherche de la page
  const { page, search } = Route.useSearch();
  // Hook des données du loader de la page
  const opportunites = Route.useLoaderData();

  // Etat local de gestion du champ de recherche
  const [newSearch, setNewSearch] = useState<string>(search || "");

  // Mise à jour du champ de recherche local lors du changement de page
  useEffect(() => setNewSearch(search || ""), [search]);

  // Décalage du lancement de changement de page suite modification champ de recherche
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      navigate({
        search: {
          page: 1,
          search: newSearch.trim().length ? newSearch.trim() : undefined,
        },
      });
    }, 500);
    return () => clearTimeout(timeOutId);
  }, [navigate, newSearch]);

  return (
    <Paper>
      <Box px={3} py={2}>
        <Typography variant="h5" gutterBottom>
          Liste des Opportunités
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          {auth.isUser && (
            <Button
              color="primary"
              variant="contained"
              startIcon={<AddCircleIcon />}
              sx={{ mb: 2 }}
              onClick={() => navigate({ to: "/opportunites/nouvelle" })}
            >
              Nouvelle Opportunité
            </Button>
          )}
          <TextField
            id="input-search"
            label="Recherche"
            value={newSearch}
            onChange={(e) => setNewSearch(e.currentTarget.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <IconButton
                  onClick={() => navigate({ search: { page: 1, search: "" } })}
                >
                  <ClearIcon />
                </IconButton>
              ),
            }}
            variant="standard"
          />
        </Box>
        <Table aria-label="table-opportunites">
          <TableHead>
            <TableRow>
              <TableCell>Client</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Créateur</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Opportunité</TableCell>
              <TableCell>Projet</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {opportunites.data.map((opp) => (
              <TableRow
                key={opp.id}
                onDoubleClick={() =>
                  navigate({ to: `/opportunites/${opp.uuid}` })
                }
              >
                <TableCell>{opp.societe}</TableCell>
                <TableCell>
                  {opp.nom} {opp.prenom}
                </TableCell>
                <TableCell>
                  {opp.createur?.nom} {opp.createur?.prenom}
                </TableCell>
                <TableCell>{formatDate(opp.createdAt)}</TableCell>
                <TableCell>{opp.opportunite}</TableCell>
                <TableCell>{opp.projet}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[itemsPerPage]}
          component="div"
          count={opportunites.nbElements}
          rowsPerPage={itemsPerPage}
          page={page !== undefined ? page - 1 : 0}
          onPageChange={(_evt, newPage) =>
            navigate({ search: (prev) => ({ ...prev, page: newPage + 1 }) })
          }
        />
      </Box>
    </Paper>
  );
};

export default Liste;
