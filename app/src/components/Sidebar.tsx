import React from "react";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { styled } from "@mui/material/styles";
import MuiDrawer, { DrawerProps as MuiDrawerProps } from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import AddIcon from "@mui/icons-material/Add";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { Form } from "../gec-tripetto";
import { displayAlert } from "../atomState";
import { getForms } from "../utils/apiCall";
import manageError from "../utils/manageError";
import { isCreator } from "../utils/auth";
import Search from "./Search";

// Définition du type des "props" attendus par le composant
type SidebarProps = {
  open?: boolean;
  drawerwidth: number;
  onToggleDrawer: () => void;
};

// Définition du type pour l'état local du composant
type Status = {
  page: number;
  titre: string | null;
  selectedForm: number | null;
};

// Extension des "props" du composant Drawer pour intégration
// du statut et de la largeur du composant
interface DrawerProps extends MuiDrawerProps {
  open?: boolean;
  drawerwidth: number;
}

// Définition du style du composant Drawer
const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})<DrawerProps>(({ theme, open, drawerwidth }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerwidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(0),
    }),
  },
}));

/**
 * Composant Barre latérale
 *    - incluant la liste des formulaires avec barre de recherche et pagination
 *    - bouton d'ajout d'un formulaire
 *
 * @returns JSX
 */
const Sidebar = ({ open, drawerwidth, onToggleDrawer }: SidebarProps) => {
  const [alerte, setAlerte] = useAtom(displayAlert);
  
  // hook de navigation
  const navigate = useNavigate();

  // définition état local du composant
  const [status, setStatus] = useState<Status>({
    page: 1,
    titre: null,
    selectedForm: null,
  });

  // query de récupération des formulaires
  const {
    isLoading,
    data: formsData,
    isError,
    error,
  } = useQuery({
    queryKey: ["getForms", status.titre, status.page],
    queryFn: () => getForms(status.titre, status.page),
    refetchOnWindowFocus: false,
  });

  // gestion des erreurs de chargement des données
  useEffect(() => {
    if (error) setAlerte({ severite: "error", message: manageError(error) });
  }, [isError]);
  // naviguation vers la page d'ajout d'un formulaire
  const addForm = () => {
    navigate("/ajouter");
  };

  // mise à jour de valeur de filtrage sur les titres des formulaires
  const handleTitleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setStatus({
      ...status,
      titre: event.currentTarget.value,
      page: 1,
      selectedForm: null,
    });
  };

  // définition du composant
  return (
    <Drawer variant="permanent" open={open} drawerwidth={drawerwidth}>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: [1],
        }}
      >
        <Search onChange={handleTitleChange} loading={isLoading} />
        {isCreator() && (
          <IconButton aria-label="ajouter formulaire" onClick={addForm}>
            <AddIcon fontSize="small" />
          </IconButton>
        )}
        <IconButton onClick={onToggleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List>
        {formsData && formsData.data.data.length > 0 ? (
          <>
            {formsData.data.data.map((form: Form, ind: number) => (
              <ListItemButton
                key={form.id}
                selected={ind === status.selectedForm}
                onClick={() => {
                  setStatus({ ...status, selectedForm: ind });
                  navigate(`/formulaire/${form.slug}`);
                }}
              >
                <ListItemText primary={form.titre} />
              </ListItemButton>
            ))}
          </>
        ) : (
          <Typography color="inherit" noWrap sx={{ flexGrow: 1 }}>
            Aucun formulaire trouvé
          </Typography>
        )}
      </List>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <IconButton
          color="primary"
          disabled={!formsData || !formsData.data.hasPrevious}
          onClick={() =>
            setStatus({
              ...status,
              page: status.page - 1,
              selectedForm: null,
            })
          }
        >
          <KeyboardDoubleArrowLeftIcon />
        </IconButton>
        <IconButton
          color="primary"
          disabled={!formsData || !formsData.data.hasNext}
          onClick={() =>
            setStatus({
              ...status,
              page: status.page + 1,
              selectedForm: null,
            })
          }
        >
          <KeyboardDoubleArrowRightIcon />
        </IconButton>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
