import React from "react"
import { useAtomValue } from "jotai";
import { Checkbox, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { ProduitAPI } from "../../gec-tripetto"
import { loggedUser } from "../../atomState";

interface ProduitItemProps {
  produit: ProduitAPI;
  selected: boolean;
  onSelect: () => void;
  onEdit: () => void;
}

const ProduitItem = ({ produit, selected, onSelect, onEdit }: ProduitItemProps) => {
  // Chargement utilisateur connecté
  const user = useAtomValue(loggedUser);

  const labelId = `checkbox-produit-${produit.id}`;

  return (
    <ListItem
      secondaryAction={
        user?.role !== "READER" &&
        <IconButton edge="end" aria-label="edit" color="warning" onClick={onEdit}>
          <EditIcon />
        </IconButton>
      }
      disablePadding>
      <ListItemButton
        selected={selected}
        onClick={onSelect}>
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={selected}
            tabIndex={-1}
            disableRipple
            inputProps={{ 'aria-labelledby': labelId }}
          />
        </ListItemIcon>
        <ListItemText primary={produit.description} />
      </ListItemButton>
    </ListItem>
  )
}

export default ProduitItem