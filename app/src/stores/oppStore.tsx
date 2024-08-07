import { atom } from "jotai";
import { FormAPI, HeaderAPI, ProduitAPI } from "@/gec-tripetto";

// Atom pour les stockage des formaulires
const formsAtom = atom<FormAPI[]>([]);

// Atom pour le stockage de l'opportunité sélectionnée
const opportuniteAtom = atom<HeaderAPI | null>(null);

// Atom pour le stockage du produit sélectionné
const produitAtom = atom<ProduitAPI | null>(null);

export { formsAtom, opportuniteAtom, produitAtom };
