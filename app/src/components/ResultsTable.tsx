import React from "react";
import { useState } from "react";
import { map } from "lodash";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TablePagination from "@mui/material/TablePagination";
import { Answer, FormAnswers } from "gec-tripetto";
import { formatDate } from "../utils/format";

// définition du type pour les Props du composant
type ResultsTableProps = {
  reponses: FormAnswers[];
};

/**
 * Tableau des résultats d'un formulaire
 * @param props
 * @returns JSX
 */
const ResultsTable = ({ reponses }: ResultsTableProps) => {
  const itemsPerPage = 10;

  // State: page du tableau des réponses
  const [page, setPage] = useState(0);

  // Gestion du changement de page du tableau de résultat
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // mise en forme des réponses à afficher dans le tableau des résultats
  const reponseString = (values: Answer[]) => {
    if (values.length === 1) {
      let val: string = '';
      if (!values[0].value) return val;
      switch (values[0].dataType) {
        case 'date':
          val = formatDate(values[0].value as number)
          break;
        default:
          val = values[0].value as string;
          break;
      }
      return val;
    } else {
      const data = map(values, (val) => {
        if (val.value) return val.name;
        else return `<s>${val.name}</s>`;
      });
      return `${data.join(" - ")}`;
    }
  };

  return (
    <>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Question</TableCell>
            <TableCell>Réponse</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(itemsPerPage > 0 ? reponses.slice(page * itemsPerPage, page * itemsPerPage + itemsPerPage) : reponses).map(
            (reponse) => (
            <TableRow key={reponse.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell component="th" scope="row">
                {(reponse.question) ? reponse.question : reponse.reponses[0].name}
              </TableCell>
              <TableCell>
                <div
                  dangerouslySetInnerHTML={{
                    __html: reponseString(reponse.reponses),
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {reponses.length > itemsPerPage && (
        <TablePagination
          rowsPerPageOptions={[itemsPerPage]}
          component="div"
          count={reponses.length}
          rowsPerPage={itemsPerPage}
          page={page}
          onPageChange={handleChangePage}
        />
      )}
    </>
  );
};

export default ResultsTable;
