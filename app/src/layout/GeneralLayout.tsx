import React, { useCallback, useState } from "react";
import { BlockerFunction, useBlocker } from "react-router";
import { useAtom } from "jotai";
import { changement } from "../atomState";
import QuitConfirmDialog from "../components/QuitConfirmDialog";

const GeneralLayout = () => {
  // Chargement de l'état Atom pour gestion de la confirmation du changement de page
  const [notSaved, setNotSaved] = useAtom(changement);

  // Création de l'état local pour affichage du menu de confirmation du changement de page
  const [showQuitDialog, setQuitDialog] = useState<boolean>(false);

  // Modification du blocker suite changement d'état de l'Atom changement 
  const shouldBlock = useCallback<BlockerFunction>(({ currentLocation, nextLocation }) => {
    if (notSaved && currentLocation.pathname !== nextLocation.pathname) {
      setQuitDialog(true);
      return true;
    } else return false;
  }, [notSaved])
  
  // Création du blocker de navigation
  const blocker = useBlocker(shouldBlock);

  /**
   * Confirmation de la navigatiion vers la page suivante
   * @param val boolean - confirmation de la navigation retournée par la boite de dialogue
   */
  const confirmNavigation = (val: boolean) => {
    setQuitDialog(false);
    if (val) {
      if (blocker.state === "blocked") {
        setNotSaved(false);
        blocker.proceed();
      }
    } else blocker.state === "unblocked";
  }

  return <QuitConfirmDialog show={showQuitDialog} confirmQuit={confirmNavigation} />
}

export default GeneralLayout;