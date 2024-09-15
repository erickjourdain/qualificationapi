import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { z } from "zod";
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
import { formsAtom } from "@/stores/mainStore";
import { formatDateTime } from "@/utils/format";
import { FormAPI } from "@/gec-tripetto";

const formSearchSchema = z.object({
  page: z.optional(z.number()),
  search: z.optional(z.string()),
});

type FormSearchSchema = z.infer<typeof formSearchSchema>;

export const Route = createFileRoute("/_auth/_adminLayout/admin/formulaires/")({
  component: () => <Formulaires />,
  validateSearch: (search: Record<string, unknown>): FormSearchSchema =>
    formSearchSchema.parse(search),
  loaderDeps: ({ search }) => ({
    page: search.page || 1,
    search: search.search || "",
  }),
});

function Formulaires() {
  // Definition du nombre d'éléments à afficher
  const itemsPerPage = 10;

  // Hook de navigation
  const navigate = useNavigate();

  // Hook des paramètres de recherche de la page
  const { page, search } = Route.useLoaderDeps();

  // Hook de stockage des formulaires
  const formulaires = useAtomValue(formsAtom);
  const [data, setData] = useState<FormAPI[]>([]);

  // Etat local de gestion du nombre de formulaires sélectionnés
  const [nbData, setNbData] = useState<number>(0);

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
            onChange={(e) => navigate({ search: { page: 1, search: e.currentTarget.value } })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <IconButton onClick={() => navigate({ search: { page: 1, search: undefined } })}>
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
              <TableRow
                key={form.id}
                onDoubleClick={() =>
                  navigate({ to: `/admin/formulaires/${form.slug}` })
                }
              >
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
          onPageChange={(_evt, newPage) => navigate({ search: (prev) => ({ ...prev, page: newPage + 1 }) })}
        />
      </Box>
    </Paper>
  );
}
