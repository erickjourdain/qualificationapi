import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { FormAPI } from "@/gec-tripetto";
import { formatDateTime } from "@/utils/format";


interface TableFormulairesProps  {
  formulaires: FormAPI[];
  onSelect: (form: FormAPI) => void;
}

const TableFormulaires = ({ formulaires, onSelect }: TableFormulairesProps) => {
  return (
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
      {formulaires.map((form) => (
        <TableRow key={form.id} onDoubleClick={() => onSelect(form)} sx={{ cursor: "pointer" }}>
          <TableCell>{form.titre}</TableCell>
          <TableCell>{form.version}</TableCell>
          <TableCell>{formatDateTime(form.updatedAt)}</TableCell>
          <TableCell>{form.createur?.nom}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
  )

} 

export default TableFormulaires;