import { atom } from 'jotai';
import { Info, Runner, User } from "./gec-tripetto";

const runner = (localStorage.getItem("runner") || "Classic") as Runner;
const loggedUser = atom<User | null>(null);
const selectedRunner = atom<Runner>(runner);
const changement = atom<boolean>(false);
const displayAlert = atom<Info | null>(null);

export {
  loggedUser,
  selectedRunner,
  changement,
  displayAlert,
}