import { User } from "./user";

export type HeaderAPI = {
  id: number;
  uuid: string;
  societe: string;
  email: string;
  telephone: string;
  nom: string;
  prenom: string;
  opportunite: string;
  projet: string;
  createur: User;
  gestionnaire: User;
  createdAt?: number;
  updatedAt?: number;
}