import React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import CardHeader from "@mui/material/CardHeader";
import red from "@mui/material/colors/red";
import Button from "@mui/material/Button";
import { Form } from "gec-tripetto";
import { isCreator } from "../utils/auth";
import { formatDate } from "../utils/format";

const Header = styled(
  CardHeader,
  {},
)(() => ({
  "& .MuiCardHeader-title": {
    fontWeight: 500,
    fontSize: "1rem",
  },
}));

type CardFormProps = {
  form: Form;
  onAction?: (statut: string) => void;
};

const CardForm = ({ form, onAction }: CardFormProps) => {
  return (
    <Box display="flex" justifyContent="center">
      <Card sx={{ minWidth: 350, maxWidth: 500 }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: red[500] }} aria-label="createur">
              {form.titre.charAt(0).toLocaleUpperCase()}
            </Avatar>
          }
          title={form.titre?.toUpperCase()}
          subheader={`v${form.version} du ${formatDate(form.createdAt)}`}
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {form.description}
          </Typography>
        </CardContent>
        {onAction && (
          <CardActions disableSpacing>
            <Button aria-label="lancer formulaire" onClick={() => onAction("play")} size="small">
              jouer
            </Button>
            <Button aria-label="voir réponses" onClick={() => onAction("answers")} size="small">
              réponses
            </Button>
            {isCreator() && 
              <Button aria-label="éditer" onClick={() => onAction("edit")} size="small">
                éditer
              </Button>
            }
          </CardActions>
        )}
      </Card>
    </Box>
  );
};

export default CardForm;
