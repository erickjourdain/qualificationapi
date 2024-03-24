import { map } from "lodash";
import { AxiosResponse } from "axios";
import React, { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { sfAnd, sfEqual, sfIn, sfLike } from "spring-filter-query-builder";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { AnswerAPI, AnswersAPI, User } from "../gec-tripetto";
import { displayAlert } from "../atomState";
import { useFormulaire } from "../pages/IndexForm";
import manageError from "../utils/manageError";
import { getFormsInit, getAnswers } from "../utils/apiCall";
import { formatDateTime } from "../utils/format";
import SearchAnswers from "./SearchAnswers";
import { TablePagination, Typography } from "@mui/material";

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
  const [forms, setForms] = useState<number[]>([]);

  // query de récupération des formulaires précédents
  const { 
    status: statusInit,
    error: errorInit,
  } = useQuery({
    queryKey: ["getForms", form],
    queryFn: () => getFormsInit(form?.formulaireInitial || form?.id || 0),
    enabled: !!form,
    refetchOnWindowFocus: false,
    select: React.useCallback((data: AxiosResponse) => {
      setForms([form?.formulaireInitial || form?.id || 0, ...map(data.data.data, "id")]);
    }, []),
  })

  // query de récupération des réponses au formulaire
  const {
    status: statusAnswers,
    error: errorAnswers,
    data: reponses,
  } = useQuery({
    queryKey: ["getAnswersTable", user, search, page],
    queryFn: () => {
      let query = [sfEqual("courante", "true"), sfIn("formulaire", forms)];
      if (user) query = [...query, sfEqual("createur", user.id)];
      if (search.trim().length) query = [...query, sfLike("reponse", `*${search}*`)];
      return getAnswers(`filter=${sfAnd(query).toString()}&page=${page + 1}&size=${itemsPerPage}`);
    },
    refetchOnWindowFocus: false,
    select: (reponse: AxiosResponse) => reponse.data as AnswersAPI,
    enabled: forms.length > 0,
  });

  // gestion des erreurs de chargement des données
  useEffect(() => {
    if (errorInit || errorAnswers) setAlerte({ severite: "error", message: manageError(errorInit|| errorAnswers)});
  }, [errorInit, errorAnswers]);

  // remise à zéro de l'état lors du déchargement du composant
  useEffect(() => {
    return () => {
      setForms([]);
      setPage(0);
      setUser(null);
      setSearch("");
    }
  }, []);

  // mise à jour de l'utilisateur sélectionné
  const onUserChange = (newUser: User | null) => {
    setUser(newUser);
  };

  // mise à jour de la chaine de caractère recherchée
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSearch(event.target.value);
  }

  // Gestion du changement de page du tableau de résultat
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  if (statusInit === 'pending') return (
    <Typography>Chargement des données ...</Typography>
  )

  // ligne pour le tableau des réponses
  const row = (reponse: AnswerAPI) => (
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
  )

  // ligne d'information
  const uniqueRow = (texte: string) => (
    <TableRow>
      <TableCell align="center" colSpan={8}>
        {texte}
      </TableCell>
    </TableRow>
  )

  return (
    <Paper
      sx={{
        marginTop: "30px",
      }}
    >
      <Box sx={{ minWidth: 400, maxWidth: "80%", margin: "auto" }}>
        <SearchAnswers onUserChange={onUserChange} onSearchChange={handleSearchChange} loading={statusAnswers === "pending"} />
        <Table aria-label="table-resultats">
          <TableHead>
            <TableRow>
              <TableCell>Ref</TableCell>
              <TableCell>Voir</TableCell>
              <TableCell>Utilisateur</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Ver. Form.</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Demande</TableCell>
              <TableCell>Opportunite</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reponses && reponses.data.length > 0 && reponses.data.map(rep => row(rep))}
            {reponses && reponses.data.length === 0 && uniqueRow("Aucune réponse disponible") }
            {statusAnswers === "pending" && uniqueRow("Chargement en cours ...") }
          </TableBody>
        </Table>
        {(reponses?.hasPrevious || reponses?.hasNext) &&
          <TablePagination
            rowsPerPageOptions={[itemsPerPage]}
            component="div"
            count={reponses?.nombreFormulaires}
            rowsPerPage={itemsPerPage}
            page={page}
            onPageChange={handleChangePage} />
        }
      </Box>
    </Paper>
  );
};

export default ResultsForm;
