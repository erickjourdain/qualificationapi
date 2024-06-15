import React, { useEffect, useRef, useState } from "react";
import { Export } from "@tripetto/runner";
import { Instance } from "@tripetto/runner/module";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtomValue, useSetAtom } from "jotai";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PrintIcon from "@mui/icons-material/Print";
import { displayAlert, loggedUser } from "../../atomState";
import { AnswerAPI, FormAPI, ProduitAPI, Statut } from "../../gec-tripetto";
import manageError from "../../utils/manageError";
import { addDevisAnswer, getAnswer, unlockAnswer, updateAnswer } from "../../utils/apiCall";
import PlayTripetto from "../PlayTripetto";
import HeaderAnswer from "./HeaderAnswer";
import Version from "./Version";
import DisplayTripetto from "./DisplayTripetto";
import Devis from "./Devis";

interface TabQualifProps {
  show: boolean;
  formulaire: FormAPI;
  produit: ProduitAPI;
}

const TabQualif = ({ show, formulaire, produit }: TabQualifProps) => {

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
  })

  // Mise à jour du vérouillage lors du changement de réponse
  useEffect(() => {
    if (answer && answer.courante && user) {
      const locked = (!!answer.lock && answer.lock.utilisateur.id !== user.id);
      setChange(!locked);
    } else setChange(false);
    setUnlock(true);
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
      queryClient.invalidateQueries({ queryKey: ["getAnswer"] })
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
      setOldVersion(version);
      setVersion(id);
      versionRef.current = id;
    }
  }

  // Gestion changement devis
  const handleDevisChange = (devis: string) => {
    if (answer) mutateDevis({ id: answer.id, devis });
  }

  // Impreesion du formulaire
  const printForm = async () => {
    if (answer) {
      // création du tableau avec les réponses au question du formulaire
      const fields = JSON.parse(answer.reponse).fields.map((field: Export.IExportableField) => { return { name: field.name, value: field.value } });
      // création du document HTML pour l'impression
      const html = `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8" />
          <meta name="robots" content="noindex" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta property="og:title" content="Formulaire" />
          <meta property="og:description" content="Reponse au Formulaire" />
          <title>Formulaire</title>
        </head>
        
        <body>
          <div id="RunnerElement">
            Chargement des données...
          </div>
          <script src="https://cdn.jsdelivr.net/npm/@tripetto/runner"></script>
          <script src="https://cdn.jsdelivr.net/npm/@tripetto/runner-classic"></script>
          <script type="module">
          const urls = [
            "https://cdn.jsdelivr.net/npm/@tripetto/runner-classic/runner/locales/fr.json", 
            "https://cdn.jsdelivr.net/npm/@tripetto/runner-classic/runner/translations/fr.json"
          ];
          const requests = urls.map(url=>fetch(url));
          Promise.all(requests)
          .then(responses => {
            const locale = responses[0].json();
            const translations = responses[1].json();
            TripettoClassic.run({
              element: document.getElementById("RunnerElement"),
              definition: ${(formulaire.formulaire)},
              onImport: (instance) => { TripettoRunner.Import.fields(instance, ${JSON.stringify(fields)}) },
              locale,
              translations,
            });
            window.onafterprint = (event) => {
              window.close();
            };
            setTimeout(() => {
              window.print();
            }, 500);        
          })
          .catch(err => document.getElementById("RunnerElement").innerHTML("Erreur durant le chargement des données..."));
          </script>
        </body>
        
        </html>   
      `
      // Ouverture du popup pour impression
      const windowFeatures = "left=100,top=100,width=1200,height=800";
      window.open(URL.createObjectURL(new Blob([html], { type: "text/html" })), "Impression Formulaire", windowFeatures);
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
                    change &&
                    <Fab
                      onClick={() => setShowTripetto(true)}
                      color="warning"
                      size="medium">
                      <PlayCircleIcon />
                    </Fab>
                  }
                  <Fab
                    onClick={() => printForm()}
                    color="primary"
                    sx={{ ml: 2 }}
                    size="medium">
                    <PrintIcon />
                  </Fab>
                </Box>
                <DisplayTripetto
                  data={JSON.parse(answer.reponse)}
                  form={JSON.parse(formulaire.formulaire)}
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