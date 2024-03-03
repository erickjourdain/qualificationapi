import { map } from "lodash";
import React, { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { sfAnd, sfEqual, sfIn, sfLike, sfOr } from "spring-filter-query-builder";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { AnswerAPI, User } from "../gec-tripetto";
import { displayAlert } from "../atomState";
import { useFormulaire } from "../pages/IndexForm";
import manageError from "../utils/manageError";
import { getFormsInit, getAnswers } from "../utils/apiCall";
import { formatDateTime } from "../utils/format";
import SearchAnswers from "./SearchAnswers";
import { TablePagination } from "@mui/material";

/**
 * Composant de présentation des résultats d'un formulaire
 * @returns JSX
 */
const ResultsForm = () => {
  const itemsPerPage = 10;

  const setAlerte = useSetAtom(displayAlert);

  const navigate = useNavigate();
  // récupération du formulaire via le contexte de la route
  const { form } = useFormulaire();

  const [user, setUser] = useState<User | null>(null);
  const [search, setSearch] = useState<String>("");
  const [page, setPage] = useState(0);

  // query de récupération des formulaires précédent
  const { data: formulaires } = useQuery({
    queryKey: ["getForms"],
    queryFn: () => getFormsInit(form?.formulaireInitial || 0),
    refetchOnWindowFocus: false,
  })

  // query de récupération des réponses au formulaire
  const {
    isLoading,
    data: reponses,
    isError,
    error,
  } = useQuery({
    queryKey: ["getAnswersTable", user, search, page],
    queryFn: () => {
      let query = [sfEqual("courante", "true"), sfIn("formulaire", [...map(formulaires?.data.data, "id"), form?.formulaireInitial || 0])];
      if (user) query = [...query, sfEqual("createur", user.id)];
      if (search.trim().length) query = [...query, sfLike("reponse", `%${search}%`)];
      //let query = user
      //  ? sfAnd([sfEqual("courante", "true"), sfIn("formulaire", [...map(formulaires?.data.data, "id"), form?.formulaireInitial || 0]), ])
      //  : sfAnd();
      return getAnswers(`filter=${sfAnd(query).toString()}&page=${page + 1}&size=${itemsPerPage}`);
    },
    refetchOnWindowFocus: false,
    enabled: !!formulaires,
  });

  // gestion des erreurs de chargement des données
  useEffect(() => {
    if (isError) setAlerte({ severite: "error", message: manageError(error) });
  }, [isError]);

  // mise à jour de l'utilisateur sélectionné
  const onUserChange = (newUser: User | null) => {
    setUser(newUser);
  };

  // Gestion du changement de page du tableau de résultat
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  return (
    <Paper
      sx={{
        marginTop: "30px",
      }}
    >
      <Box sx={{ minWidth: 400, maxWidth: "80%", margin: "auto" }}>
        <SearchAnswers onUserChange={onUserChange} onSearchChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setSearch(event.target.value)} loading={isLoading} />
        <Table aria-label="table-resultats">
          <TableHead>
            <TableRow>
              <TableCell>Ref</TableCell>
              <TableCell>Voir</TableCell>
              <TableCell>Utilisateur</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Version</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Demande</TableCell>
              <TableCell>Opportunite</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reponses &&
              reponses.data.data.map((reponse: AnswerAPI) => (
                <TableRow key={reponse.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell>{reponse.id}</TableCell>
                  <TableCell>
                    <VisibilityIcon sx={{ cursor: "pointer" }} onClick={() => navigate({ pathname: `${reponse.uuid}/${reponse.version}` })} />
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {reponse.createur.nom} {reponse.createur.prenom}
                  </TableCell>
                  <TableCell>{formatDateTime(reponse.createdAt)}</TableCell>
                  <TableCell>{reponse.formulaire.version}</TableCell>
                  <TableCell>{reponse.statut}</TableCell>
                  <TableCell>{reponse.demande ? `DEM${reponse.demande}` : ""}</TableCell>
                  <TableCell>{reponse.opportunite ? `OPP${reponse.opportunite}` : ""}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {(reponses?.data.hasPrevious || reponses?.data.hasNext) &&
          <TablePagination
            rowsPerPageOptions={[itemsPerPage]}
            component="div"
            count={reponses?.data.nombreReponses}
            rowsPerPage={itemsPerPage}
            page={page}
            onPageChange={handleChangePage} />
        }
      </Box>
    </Paper>
  );
};

export default ResultsForm;
