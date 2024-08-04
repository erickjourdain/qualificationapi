import { atom } from "jotai";
import { FormAPI, ProduitAPI } from "@/gec-tripetto";

// Atom pour les stockage des formaulires
const formsAtom = atom<FormAPI[]>([]);

// Atom pour le stockage des alertes d'information
const produitAtom = atom<ProduitAPI | null>(null);

export {
  formsAtom,
  produitAtom
}