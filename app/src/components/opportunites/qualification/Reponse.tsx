import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { find, findIndex } from "lodash";
import { useSetAtom } from "jotai";
import createReport from "docx-templates";
import { Export, Instance } from "@tripetto/runner";
import { Box, Fab } from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import SaveIcon from "@mui/icons-material/Save";
import { Route as RteOpp } from "@/routes/_auth/opportunites/$uuid";
import { useAuth } from "@/hooks/auth";
import { AnswerAPI, ProduitAPI } from "@/gec-tripetto";
import DisplayTripetto from "./DisplayTripetto";
import PlayTripetto from "@/components/PlayTripetto";
import { useMutation } from "@tanstack/react-query";
import { updateAnswer } from "@/utils/apiCall";
import { alertAtom } from "@/stores/mainStore";
import manageError from "@/utils/manageError";
import saveDataToFile from "@/utils/download";
import { formatDateTime } from "@/utils/format";
import decodeFormulaire from "@/utils/decodeFormulaire";

interface Question {
  label: string;
  reponse: string;
}

interface Rapport {
  date_rapport: string;
  raison_sociale: string;
  contact: string;
  opportunite: string;
  date_creation: string;
  createur_opportunite: string;
  produit: string;
  formulaire: string;
  version: number;
  date_qualification: string;
  gestionnaire_formulaire: string;
  questions: Question[];
}

const Reponse = () => {
  // Hook de navigation
  const navigate = useNavigate();
  // Hook de Gestion des autorisations
  const auth = useAuth();
  // Hook de récupération des données
  const data = RteOpp.useLoaderData();
  // Hook d'affichage des alertes
  const setAlerte = useSetAtom(alertAtom);
  // Etats local pour gestion de la réponse sélectionnée et affichage
  const [reponse, setReponse] = useState<AnswerAPI | null>(null);
  const [render, setRender] = useState<boolean>(false);
  // Etat local de lancement d'une nouvelle version
  const [start, setStart] = useState<boolean>(false);

  // Mise à jour de la réponse
  const { mutate } = useMutation({
    mutationKey: ["majReponse"],
    mutationFn: updateAnswer,
    onSuccess: ({ data: reponse }) => {
      setAlerte({
        severite: "success",
        message: "l'opportunité a été mise à jour",
      });
      navigate({
        search: (prev) => {
          return { ...prev, version: reponse.id };
        },
      });
    },
    onError: (error) => {
      setAlerte({ severite: "error", message: manageError(error) });
    },
  });

  // Récupération de la réponse à afficher
  useEffect(() => {
    setRender(false);
    // attente pour laisser le temps nécessaire à la mise à jour du composant de visualisation du formulaire
    setTimeout(() => {
      const index = findIndex(
        data.reponses,
        (rep) => rep.id === data.selection.version,
      );
      if (index >= 0) {
        setReponse(data.reponses[index]);
        setRender(true);
      }
    }, 250);
  }, [data.reponses, data.selection.version]);

  // Sauvegarde du formulaire
  const saveForm = useCallback(async () => {
    const produit = find(data.produits, (p: ProduitAPI) => p.id === data.selection.produit)?.description || "";
    const formulaire = reponse?.formulaire.titre || "";
    const version = reponse?.version || 0;
    const curDate = new Date();
    const rapport: Rapport = {
      date_rapport: formatDateTime(curDate.getTime()),
      raison_sociale: data.header.societe,
      contact: `${data.header.nom} ${data.header.prenom}`,
      opportunite: (data.header.opportunite && data.header.opportunite.length)
        ? data.header.opportunite : "Opportunité",
      date_creation: formatDateTime(data.header.createdAt),
      createur_opportunite: `${data.header.createur?.nom} ${data.header.createur?.prenom}`,
      produit,
      formulaire,
      version,
      date_qualification: formatDateTime(reponse?.updatedAt),
      gestionnaire_formulaire: `${reponse?.gestionnaire.nom} ${reponse?.gestionnaire.prenom}`,
      questions: [],
    };

    // const iframeContent = $("iframe").contents();
    const iframe = document.querySelector("iframe");
    rapport.questions = decodeFormulaire(iframe);

    const template = await fetch("/assets/rapport tripetto.docx").then((res) =>
      res.arrayBuffer(),
    );

    const report = await createReport({
      template, // l'erreur est lié aux Polyfills node.js qui ne sont pas intégrés par défaut. Ne pas en tenir compte de l'erreur
      data: rapport,
      cmdDelimiter: ["{{", "}}"],
    });

    saveDataToFile(
      report,
      `${curDate.toISOString().split('T')[0].replace(/-/g, '')}-${data.header.societe} ${formulaire} V${version}.docx`,
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reponse]);

  // Validation du formualire Tripetto
  const onSubmit = useCallback(
    (instance: Instance) => {
      setStart(false);
      const exportables = Export.exportables(instance);
      if (reponse)
        mutate({ id: reponse.id, reponse: JSON.stringify(exportables) });
      return true;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reponse],
  );

  return (
    <Box display="flex" flexDirection="column">
      <Box sx={{ alignSelf: "flex-end" }}>
        {data.selection.versionLocked && auth.isUser && (
          <Fab onClick={() => setStart(true)} color="warning" size="medium">
            <PlayCircleIcon />
          </Fab>
        )}
        <Fab onClick={saveForm} color="primary" sx={{ ml: 2 }} size="medium">
          <SaveIcon />
        </Fab>
      </Box>
      <DisplayTripetto
        data={reponse ? JSON.parse(reponse.reponse) : ""}
        form={reponse ? JSON.parse(reponse.formulaire.formulaire) : ""}
        render={render}
      />
      <PlayTripetto
        open={start}
        onClose={() => setStart(false)}
        data={reponse ? JSON.parse(reponse.reponse) : ""}
        form={reponse ? JSON.parse(reponse.formulaire.formulaire) : ""}
        onSubmit={onSubmit}
      />
    </Box>
  );
};

export default Reponse;
