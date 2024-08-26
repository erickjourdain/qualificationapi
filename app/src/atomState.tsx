import { atom } from 'jotai';
import { Info, Runner, User } from "./gec-tripetto";

let message: string | null;

switch (process.env.NODE_ENV) {
  case "development":
    message = "Vous travaillez sur l'environnement de développement";
    break;
  case "test":
    message = "Vous travaillez sur l'environnement de test";
    break;
  default:
    message = null;
    break;
}

const runner = (localStorage.getItem("runner") || "Classic") as Runner;
const loggedUser = atom<User | null>(null);
const selectedRunner = atom<Runner>(runner);
const changement = atom<boolean>(false);
const displayAlert = atom<Info | null>(null);
const environnementInfo = atom<String | null>(message);

export {
  loggedUser,
  selectedRunner,
  changement,
  displayAlert,
  environnementInfo,
}