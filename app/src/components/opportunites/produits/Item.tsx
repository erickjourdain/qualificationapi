import { useNavigate } from "@tanstack/react-router";
import {
  Checkbox,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useAuth } from "@/hooks/auth";
import { ProduitAPI } from "@/gec-tripetto";
import { Route } from "@/routes/_auth/opportunites/$uuid";

interface ProduitItemProps {
  prodItem: ProduitAPI;
  onEdit: () => void;
}

const ProduitItem = ({ prodItem, onEdit }: ProduitItemProps) => {
  // Hook de Gestion des autorisations
  const auth = useAuth();
  // Hook de navigation
  const navigate = useNavigate();
  // Hook récupération produit sélectionné
  const { selection } = Route.useLoaderData();

  return (
    <ListItem
      secondaryAction={
        auth.isUser && (
          <IconButton
            edge="end"
            aria-label="edit"
            color="warning"
            onClick={onEdit}
          >
            <EditIcon />
          </IconButton>
        )
      }
      disablePadding
    >
      <ListItemButton
        selected={prodItem.id === selection.produit}
        onClick={() =>
          navigate({
            search: (prev) => {
              return { ...prev, produit: prodItem.id };
            },
          })
        }
      >
        <ListItemIcon>
          <Checkbox
            id={`checkbox-selection-${prodItem.id}`}
            edge="start"
            checked={prodItem.id === selection.produit}
            tabIndex={-1}
            disableRipple
          />
        </ListItemIcon>
        <ListItemText primary={prodItem.description} />
      </ListItemButton>
    </ListItem>
  );
};

export default ProduitItem;
