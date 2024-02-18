import React from "react";
import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TablePagination from "@mui/material/TablePagination";
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import Typography from "@mui/material/Typography";
import { Answer, Form, FormAnswers } from "../gec-tripetto";
import { formTripettoAnswers, formatDate } from "../utils/format";

type TableReponseProps = {
  form: Form;
  reponses: string[];
};

const TableReponse = ({ form, reponses }: TableReponseProps) => {
  const itemsPerPage = 10;

  // State: page du tableau des réponses
  const [page, setPage] = useState(0);
  const [formAnswers, setFormAnswers] = useState<FormAnswers[][]>([]);

  // Remise à jour des données suite changement des props
  useEffect(() => {
    setFormAnswers([]);
    const answers: FormAnswers[][] = [];
    for (let index = 0; index < reponses.length; index++) {
      answers.push(formTripettoAnswers(form, JSON.parse(reponses[index])));
    }
    setFormAnswers(answers);
  }, [reponses]);

  // Gestion du changement de page du tableau de résultat
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // mise en forme des réponses à afficher dans le tableau des résultats
  const reponseString = (reponse: FormAnswers) => {
    if (reponse.reponses.length === 0) return null;
    switch (reponse.type) {
      case "@tripetto/block-email":
      case "@tripetto/block-text":
      case "@tripetto/block-textarea":
      case "@tripetto/block-number":
      case "@tripetto/block-dropdown":
      case "@tripetto/block-rating":
      case "@tripetto/block-radiobuttons":
      case "@tripetto/block-date": 
        switch (reponse.reponses[0].dataType) {
          case "date":
            return <Typography>{formatDate(reponse.reponses[0].value as number)}</Typography>;
          default:
            return <Typography>{reponse.reponses[0].value as string}</Typography>;
        }
      case "@tripetto/block-yes-no":
        switch (reponse.reponses[0].value) {
          case "Yes":
            return <Typography>oui</Typography>;
          case "No":
            return <Typography>non</Typography>;
          default:
            return <Typography></Typography>;
        }
      case "@tripetto/block-multi-select":
      case "@tripetto/block-checkboxes":
        return (
          <>
            <Typography>{reponse.reponses.filter((rep: Answer) => rep.value).map((rep: Answer) => rep.name).join(" - ")}</Typography>
            <Typography><s>{reponse.reponses.filter((rep: Answer) => !rep.value).map((rep: Answer) => rep.name).join(" - ")}</s></Typography>
          </>
        );
      case "@tripetto/block-ranking":
        return <Typography>{reponse.reponses.map((rep: Answer) => rep.value).join(" - ")}</Typography>;
    }
  };

  return (
    <>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: "50%" }}>Question</TableCell>
            <TableCell sx={formAnswers.length === 1 ? { width: "50%" } : { width: "25%" }}>Réponse</TableCell>
            {formAnswers.length > 1 && <TableCell sx={{ width: "25%" }}>Mise à jour</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {formAnswers.length > 0 &&
            (itemsPerPage > 0 ? formAnswers[0].slice(page * itemsPerPage, page * itemsPerPage + itemsPerPage) : formAnswers[0]).map(
              (reponse, ind) => (
                <TableRow key={reponse.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {reponse.question ? reponse.question : reponse.reponses[0].name}
                  </TableCell>
                  <TableCell>
                    {
                      (reponseString(reponse)) || <DoNotDisturbIcon color="warning" />
                    }
                  </TableCell>
                  {formAnswers.length > 1 && (
                    <TableCell>
                      {
                        (reponseString(formAnswers[1][page * itemsPerPage + ind])) || <DoNotDisturbIcon color="warning" />
                      }
                    </TableCell>
                  )}
                </TableRow>
              ),
            )}
        </TableBody>
      </Table>
      {formAnswers.length > 0 && formAnswers[0].length > itemsPerPage && (
        <TablePagination
          rowsPerPageOptions={[itemsPerPage]}
          component="div"
          count={formAnswers[0].length}
          rowsPerPage={itemsPerPage}
          page={page}
          onPageChange={handleChangePage}
        />
      )}
    </>
  );
};

export default TableReponse;
