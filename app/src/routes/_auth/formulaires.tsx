import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import {
  Box,
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
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { formsAtom } from "@/stores/oppStore";
import { formatDateTime } from "@/utils/format";
import { FormAPI } from "@/gec-tripetto";

export const Route = createFileRoute("/_auth/formulaires")({
  component: Formulaires,
});

function Formulaires() {
  // Definition du nombre d'éléments à afficher
  const itemsPerPage = 10;

  // Hook de stockage des formulaires
  const formulaires = useAtomValue(formsAtom);
  const [data, setData] = useState<FormAPI[]>([]);

  // Etat local de gestion de la page affichée
  const [page, setPage] = useState<number>(1);
  // Etat local de gestion du nombre de formulaires sélectionnés
  const [nbData, setNbData] = useState<number>(0);
  // Etat local de gestion du champ de recherche
  const [search, setSearch] = useState<string>("");

  // Mise à jour des données à afficher
  useEffect(() => {
    const filter = new RegExp(String.raw`${search.trim()}`, "i");
    const filteredItems = search.trim().length
      ? formulaires.filter((value) => value.titre.search(filter) >= 0)
      : formulaires;
    setNbData(filteredItems.length);
    setData(
      filteredItems.slice((page - 1) * itemsPerPage, page * itemsPerPage),
    );
  }, [formulaires, search, page]);

  return (
    <Paper>
      <Box px={3} py={2}>
        <Typography variant="h5" gutterBottom>
          Liste des Formulaires disponibles
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "right" }}>
          <TextField
            id="input-search"
            label="Recherche"
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <IconButton onClick={() => setSearch("")}>
                  <ClearIcon />
                </IconButton>
              ),
            }}
            variant="standard"
          />
        </Box>

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
            {data.map((form) => (
              <TableRow key={form.id}>
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
          count={nbData}
          rowsPerPage={itemsPerPage}
          page={page !== undefined ? page - 1 : 0}
          onPageChange={(_evt, newPage) => setPage(newPage + 1)}
        />
      </Box>
    </Paper>
  );
}
