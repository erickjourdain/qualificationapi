import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import { atomWithStorage } from 'jotai/utils';
import { getCurrentUser, setAuthorisation } from "../utils/apiCall";
import { Info, User } from "../gec-tripetto";

// Atom pour le stockage du theme
const modeAtom = atomWithStorage<string|null>("mode", localStorage.getItem("mode"));

// Atom pour le stockage du token d'identification au backend stocké dans l'applicatif
const tokenAtom = atomWithStorage<string|null>("token", localStorage.getItem("token"));

// Atom pour le stockage du runner stocké dans l'applicatif
const runnerAtom = atomWithStorage<string|null>("runner", localStorage.getItem("runner") || "Autoscroll");

// Atom pour le stockage des alertes d'information
const alertAtom = atom<Info | null>(null);

// Atom pour le stockage de l'utilisateur connecté obtenu via un appel à l'API
const userAtom = atomWithQuery((get) => ({
  queryKey: ['currentUser', get(tokenAtom)],
  queryFn: async ({ queryKey: [, token] }):Promise<User> => {
    const t = token as string;
    setAuthorisation(t);
    const res = await getCurrentUser();
    return res.data;
  },
  retry: false,
}));

// Atom pour le stockage du rôle ADMIN ou non de l'utilisateur connecté
const adminAtom = atom<boolean>((get) => {
  const { data, isPending, isError } = get(userAtom);
  return (isPending || isError) ? false : !!(data && data.role === "ADMIN");
});

// Atom pour le stockage du rôle CREATOR ou non de l'utilisateur connecté
const creatorAtom = atom<boolean>((get) => {
  const { data, isPending, isError } = get(userAtom);
  return (isPending|| isError) 
    ? false 
    : (!!(data && (data.role === "ADMIN" || data.role === "CREATOR")));
})

// Atom pour le stockage du rôle READER ou non de l'utilisateur connecté
const readerAtom = atom((get) => {
  const { data }= get(userAtom);
  return !!(data && data.role === "READER");
});

export {
  modeAtom,
  alertAtom,
  tokenAtom,
  userAtom,
  adminAtom,
  creatorAtom,
  readerAtom,
  runnerAtom,
}