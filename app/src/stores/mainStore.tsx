import { atom, createStore } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { IChatStyles } from "@tripetto/runner-chat";
import { FormAPI, Info } from "@/gec-tripetto";

type Environment = "development"|"test"|"production";

// Atom pour le stockage de l'environnement et l'adresse du serveur de l'API
let environnement: Environment;

if (window.location.origin.includes("localhost")) environnement = "development"
else if (window.location.origin.includes("dev-")) environnement = "development"
else if (window.location.origin.includes("test-")) environnement = "test"
else environnement = "production";

const urlAPI: string= window.location.origin.includes("localhost") ? import.meta.env.VITE_API_URL 
  : `${window.location.origin}`;

const apiAtom = atom<string>(urlAPI);
const envAtom = atom<Environment>(environnement);
const store = createStore();
store.set(apiAtom, urlAPI);
store.set(envAtom, environnement);

// Atom pour le stockage du theme
const modeAtom = atomWithStorage<string | null>(
  "mode",
  localStorage.getItem("mode"),
);

// Atom pour le style de visualisation des formulaires Tripetto
const stylesTripetto = atom<IChatStyles>((get) => {
  return {
    color: get(modeAtom) === "dark" ? "white" : "black",
  };
});

// Atom pour le stockage du runner stocké dans l'applicatif
const runnerAtom = atomWithStorage<string | null>(
  "runner",
  localStorage.getItem("runner") || "Autoscroll",
);

// Atom pour le stockage des alertes d'information
const alertAtom = atom<Info | null>(null);

// Atom pour les stockage des formulaires
const formsAtom = atom<FormAPI[]>([]);



export { modeAtom, alertAtom, runnerAtom, stylesTripetto, formsAtom, envAtom, apiAtom, store };
