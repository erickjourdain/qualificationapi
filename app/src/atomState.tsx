import { atom } from 'jotai';
import { Info, Runner, User } from "./gec-tripetto";

const loggedUser = atom<User | null>(null);
const selectedRunner = atom<Runner>("Autoscroll");
const changement = atom<boolean>(false);
const displayAlert = atom<Info | null>(null);

export {
  loggedUser,
  selectedRunner,
  changement,
  displayAlert,
}