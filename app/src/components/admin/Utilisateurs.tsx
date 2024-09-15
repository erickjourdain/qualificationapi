import { useNavigate } from "@tanstack/react-router";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
} from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import Typography from "@mui/material/Typography";
import TableHead from "@mui/material/TableHead";
import { Route } from "@/routes/_auth/_adminLayout/admin/utilisateurs";

const Utilisateurs = () => {
  // Hook de navigation
  const navigate = useNavigate();

  // Hook des paramètres de recherche de la page
  const { page } = Route.useSearch();
  // Hook des données du loader de la page
  const users = Route.useLoaderData();

  const icon = (val: boolean) => {
    return val ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />;
  };

  if (users)
    return (
      <Paper>
        <Box px={3} py={2}>
          <Typography variant="h5" gutterBottom>
            Utilisateurs
          </Typography>
          <Table aria-label="table-users">
            <TableHead>
              <TableRow>
                <TableCell>Utilisateur</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Validé</TableCell>
                <TableCell>Bloqué</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.data.map((user) => (
                <TableRow
                  key={user.id}
                  onDoubleClick={() =>
                    navigate({ to: `/admin/utilisateurs/${user.slug}` })
                  }
                  sx={{ cursor: "pointer " }}
                >
                  <TableCell>{`${user.prenom} ${user.nom}`}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{icon(user.validated)}</TableCell>
                  <TableCell>{icon(user.locked)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>{" "}
          <TablePagination
            rowsPerPageOptions={[10]}
            component="div"
            count={users.nbElements}
            rowsPerPage={10}
            page={page !== undefined ? page - 1 : 0}
            onPageChange={(_evt, newPage) =>
              navigate({ search: (prev) => ({ ...prev, page: newPage + 1 }) })
            }
          />
        </Box>
      </Paper>
    );
};

export default Utilisateurs;
