import React, { useEffect, useRef, useState } from "react";
import { Export } from "@tripetto/runner";
import { Instance } from "@tripetto/runner/module";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtomValue, useSetAtom } from "jotai";
import createReport from "docx-templates";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import SaveIcon from "@mui/icons-material/Save";
import { displayAlert, loggedUser } from "../../atomState";
import { AnswerAPI, FormAPI, HeaderAPI, ProduitAPI, Statut } from "../../gec-tripetto";
import manageError from "../../utils/manageError";
import { addDevisAnswer, getAnswer, unlockAnswer, updateAnswer } from "../../utils/apiCall";
import PlayTripetto from "../PlayTripetto";
import HeaderAnswer from "./HeaderAnswer";
import Version from "./Version";
import DisplayTripetto from "./DisplayTripetto";
import Devis from "./Devis";
import { formatDateTime } from "../../utils/format";
import decodeFormulaire from "../../utils/decodeFormulaire";
import saveDataToFile from "../../utils/download";

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

interface TabQualifProps {
  show: boolean;
  header: HeaderAPI;
  formulaire: FormAPI;
  produit: ProduitAPI;
}

const TabQualif = ({ show, header, formulaire, produit }: TabQualifProps) => {

  // Chargement de l'utilisateur connecté
  const user = useAtomValue(loggedUser);
  // Chargement de l'état Atom de gestion des alertes
  const setAlerte = useSetAtom(displayAlert);

  // Hook de gestion des requêtes ver l'API
  const queryClient = useQueryClient();

  // Stockage de l'id de la réponse pour dévérouillahge lors du changement de page
  const versionRef = useRef<string | null>(null);

  // State du composant
  const [version, setVersion] = useState<string | null>(null);
  const [oldVersion, setOldVersion] = useState<string | null>(null);
  const [showTripetto, setShowTripetto] = useState<boolean>(false);
  const [change, setChange] = useState<boolean>(false);
  const [unlock, setUnlock] = useState<boolean>(false);
  const [majRep, setMajRep] = useState<number>(0);
  const [render, setRender] = useState<boolean>(false);

  // Chargement de la réponse à afficher
  const { data: answer } = useQuery({
    queryKey: ["getAnswer", version],
    queryFn: () => {
      const id = (version) ? parseInt(version) : null;
      if (id !== null) return getAnswer(id);
      else return null;
    },
    select: (reponse) => {
      if (reponse) {
        return reponse.data as AnswerAPI;
      }
    },
    enabled: !!version,
    throwOnError: (error, _query) => {
      setAlerte({ severite: "error", message: manageError(error) });
      return false;
    },
  });

  // Unlock previous answer
  const { data: unlocked } = useQuery({
    queryKey: ["unlockAnswer", oldVersion],
    queryFn: () => (oldVersion && unlock && user?.role !== "READER") ? unlockAnswer(parseInt(oldVersion)) : null,
    /*() =>{
      //if (change && oldVersion && (oldVersion !== version)) 
        //return unlockAnswer(parseInt(oldVersion));
      //else return null;
    },*/
    select: (reponse) => (reponse) ? reponse.data as boolean : null,
  });

  // Reset de la version lors du changement de produit
  useEffect(() => {
    setVersion(null);
  }, [produit]);

  // Mise à jour du vérouillage lors du changement de réponse
  useEffect(() => {
    if (answer && answer.courante && user) {
      const locked = (!!answer.lock && answer.lock.utilisateur.id !== user.id);
      setChange(!locked);
    } else setChange(false);
    setUnlock(true);
    setRender(true);
  }, [answer]);

  // Mise à jour de l'état de dévérouillage
  useEffect(() => {
    setUnlock(!unlocked);
  }, [unlocked]);

  // Dévérouillage lors du déchargement du composant
  useEffect(() => {
    return () => {
      if (versionRef.current && user?.role !== "READER") unlockAnswer(parseInt(versionRef.current));
    };
  }, []);

  // Mise à jour de la réponse
  const { mutate: mutateAnswer } = useMutation({
    mutationFn: updateAnswer,
    onSuccess: () => {
      setAlerte({ severite: "success", message: "l'opportunité a été mise à jour" });
      setMajRep(majRep + 1);
      queryClient.invalidateQueries({ queryKey: ["getAnswer"] });
    },
    onError: (error) => {
      setAlerte({ severite: "error", message: manageError(error) });
      queryClient.invalidateQueries({ queryKey: ["getAnswer"] });
    }
  })

  // Mise à jour du devis
  const { mutate: mutateDevis } = useMutation({
    mutationFn: addDevisAnswer,
    onSuccess: () => {
      setAlerte({ severite: "success", message: "l'opportunité a été mise à jour" });
      setMajRep(majRep + 1);
      queryClient.invalidateQueries({ queryKey: ["getAnswer"] });
    },
    onError: (error) => {
      setAlerte({ severite: "error", message: manageError(error) });
      queryClient.invalidateQueries({ queryKey: ["getAnswer"] });
    }
  })

  // Changemenent du statut du devis
  const onStatutChange = (statut: Statut) => {
    if (answer) mutateAnswer({
      id: answer.id,
      statut
    });
  }

  // Validation du formualire Tripetto
  const onSubmit = (instance: Instance) => {
    setShowTripetto(false);
    const exportables = Export.exportables(instance);
    if (answer)
      mutateAnswer({
        id: answer?.id,
        reponse: JSON.stringify(exportables),
      });
    return true;
  }

  // Gestion changement version
  const handleVersionChange = (id: string) => {
    if (id !== version) {
      setRender(false);
      setOldVersion(version);
      setVersion(id);
      versionRef.current = id;
      queryClient.invalidateQueries({ queryKey: ["getAnswer"] });
    }
  }

  // Gestion changement devis
  const handleDevisChange = (devis: string) => {
    if (answer) mutateDevis({ id: answer.id, devis });
  }

  // Impreesion du formulaire
  const saveForm = async () => {
    if (answer) {
      const curDate = new Date();
      const rapport: Rapport = {
        date_rapport: formatDateTime(curDate.getTime()),
        raison_sociale: header.societe,
        contact: `${header.nom} ${header.prenom}`,
        opportunite: (header.opportunite && header.opportunite.length)
          ? header.opportunite : "Opportunité",
        date_creation: formatDateTime(header.createdAt),
        createur_opportunite: `${header.createur?.nom} ${header.createur?.prenom}`,
        produit: produit.description,
        formulaire: formulaire.titre,
        version: answer.version,
        date_qualification: formatDateTime(answer.updatedAt),
        gestionnaire_formulaire: `${answer.gestionnaire.nom} ${answer.gestionnaire.prenom}`,
        questions: [],
      };
  
      // const iframeContent = $("iframe").contents();
      const iframe = document.querySelector("iframe");
      rapport.questions = decodeFormulaire(iframe);
  
      const template = await fetch("/assets/rapport tripetto.docx").then((res) =>
        res.arrayBuffer(),
      );
  
      const report = await createReport({
        template: new Uint8Array(template), // l'erreur est lié aux Polyfills node.js qui ne sont pas intégrés par défaut. Ne pas en tenir compte de l'erreur
        data: rapport,
        cmdDelimiter: ["{{", "}}"],
      });
  
      saveDataToFile(
        report,
        `${curDate.toISOString().split('T')[0].replace(/-/g, '')}-${header.societe} ${formulaire.titre} V${answer.version}.docx`,
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      );
    }
  }

  return (
    <div
      role="tabpanel"
      hidden={!show}
      id={`tabpanel-${formulaire.id}`}
    >
      {show && (
        <Box>
          <Box m={1} >
            <Version formulaire={formulaire} produit={produit} maj={majRep} onChangeVer={handleVersionChange} />
            <Devis answer={answer} onChangeDevis={handleDevisChange} />
          </Box>
          {answer &&
            <>
              <HeaderAnswer answer={answer} onStatutChange={onStatutChange} />
              <Box display="flex" flexDirection="column">
                <Box
                  sx={{ alignSelf: "flex-end" }}>
                  {
                    change && user?.role !== "READER" &&
                    <Fab
                      onClick={() => setShowTripetto(true)}
                      color="warning"
                      size="medium">
                      <PlayCircleIcon />
                    </Fab>
                  }
                  <Fab
                    onClick={() => saveForm()}
                    color="primary"
                    sx={{ ml: 2 }}
                    size="medium">
                    <SaveIcon />
                  </Fab>
                </Box>
                <DisplayTripetto
                  data={JSON.parse(answer.reponse)}
                  form={JSON.parse(formulaire.formulaire)}
                  render={render && show}
                />
                <PlayTripetto
                  open={showTripetto}
                  onClose={function (): void {
                    setShowTripetto(false);
                  }}
                  form={JSON.parse(formulaire.formulaire)}
                  data={JSON.parse(answer.reponse)}
                  onSubmit={onSubmit}
                />
              </Box>
            </>
          }
        </Box>
      )}
    </div>
  );
}


export default TabQualif;