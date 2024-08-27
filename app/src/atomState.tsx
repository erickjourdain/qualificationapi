import { atom } from "jotai";
import { User } from "./gec-tripetto";

const loggedUser = atom<User | null>(null);
const changement = atom<boolean>(false);

export { loggedUser, changement };
