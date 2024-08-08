import { useAtom } from "jotai";
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
import { produitAtom } from "@/stores/oppStore";

interface ProduitItemProps {
  prodItem: ProduitAPI;
  onEdit: () => void;
}

const ProduitItem = ({ prodItem, onEdit }: ProduitItemProps) => {
  // Hook de Gestion des autorisations
  const auth = useAuth();
  // Hook état global du produit sélectionné
  const [produit, setProduit] = useAtom(produitAtom);

  //const labelId = `checkbox-produit-${prodItem.id}`;

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
        selected={prodItem.id === produit?.id}
        onClick={() => setProduit(prodItem)}
      >
        <ListItemIcon>
          <Checkbox
            id={`checkbox-selection-${prodItem.id}`}
            edge="start"
            checked={prodItem.id === produit?.id}
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
