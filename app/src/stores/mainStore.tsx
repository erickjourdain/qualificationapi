import { atom } from "jotai";
//import { atomWithQuery } from "jotai-tanstack-query";
import { atomWithStorage } from 'jotai/utils';
//import { getCurrentUser, setAuthorisation } from "../utils/apiCall";
import { Info } from "../gec-tripetto";

// Atom pour le stockage du theme
const modeAtom = atomWithStorage<string | null>("mode", localStorage.getItem("mode"));

// Atom pour le stockage du runner stocké dans l'applicatif
const runnerAtom = atomWithStorage<string | null>("runner", localStorage.getItem("runner") || "Autoscroll");

// Atom pour le stockage des alertes d'information
const alertAtom = atom<Info | null>(null);


export {
  modeAtom,
  alertAtom,
  runnerAtom,
}