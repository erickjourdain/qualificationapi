import React, { useEffect, useState } from "react";
import { useSetAtom } from "jotai";
import { useQuery } from "@tanstack/react-query";
import { sfEqual } from "spring-filter-query-builder";
import { Box, Paper, Skeleton, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { displayAlert } from "../atomState";
import { FormAPI, FormsAPI } from "../gec-tripetto";
import { getForms } from "../utils/apiCall";
import manageError from "../utils/manageError";
import { formatDateTime } from "../utils/format";
import PlayTripetto from "../components/PlayTripetto";

const Formulaires = () => {

  const itemsPerPage = 10;

  // Chargement de l'état Atom des alertes
  const setAlerte = useSetAtom(displayAlert);

  // State: page du tableau
  const [page, setPage] = useState(0);
  // State: formulaires
  const [formulaires, setFormulaires] = useState<FormAPI[]>([]);
  // State: nombre formulaires
  const [nbFormulaires, setNbFormulaires] = useState<number>(0);
  // State: formulaire sélectionné
  const [selected, setSelected] = useState<number | null>(null);

  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["getForms", page],
    queryFn: () => {
      const filter = sfEqual("valide", "true");
      return getForms(filter.toString(), page + 1, ["id", "titre", "version", "formulaire", "createur", "updatedAt", "slug"], itemsPerPage);
    },
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
            {formulaires.map((form, ind) => (
              <TableRow key={form.id} onDoubleClick={() => {setSelected(ind)}} sx={{ cursor: "pointer" }}>
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
      {
        <PlayTripetto
          open={!!selected}
          onClose={() => setSelected(null)}
          form={(selected !== null) ? JSON.parse(formulaires[selected].formulaire) : ""}
          onSubmit={() => { setSelected(null); return true }}
          titre={(selected !== null) ? `Tester le formulaire ${formulaires[selected].titre}` : undefined}
        />
      }
    </Paper>
  )
}

export default Formulaires;