import React from "react";
import { useNavigate } from "react-router";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TablePagination from "@mui/material/TablePagination";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { formatDate } from "../../utils/format";
import { HeadersAPI } from "../../gec-tripetto";

interface TableauHeaders {
  headers: HeadersAPI,
  loading: boolean,
  onPageChange: (_event: unknown, newPage: number) => void,
}

const Tableau = ({ headers, loading, onPageChange }: TableauHeaders) => {

  const navigate = useNavigate();

  return (
    <Box>
      <Table aria-label="table-headers">
        <TableHead>
          <TableRow>
            <TableCell>Voir</TableCell>
            <TableCell>Client</TableCell>
            <TableCell>Créateur</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Opportunité</TableCell>
            <TableCell>Projet</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!loading && headers.data.map((header) => (
            <TableRow key={header.id}>
              <TableCell>
                <VisibilityIcon sx={{ cursor: "pointer" }} onClick={() => navigate(`/opportunite/${header.uuid}`) } />
              </TableCell>
              <TableCell>{header.societe}</TableCell>
              <TableCell>{header.createur.nom} {header.createur.prenom}</TableCell>
              <TableCell>{formatDate(header.createdAt)}</TableCell>
              <TableCell>{header.opportunite}</TableCell>
              <TableCell>{header.projet}</TableCell>
            </TableRow>
          ))}
          {loading && <CircularProgress />}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[headers.size]}
        component="div"
        count={headers.nbElements}
        rowsPerPage={headers.size}
        page={headers.page - 1}
        onPageChange={onPageChange}
      />
    </Box>
  )
}

export default Tableau;