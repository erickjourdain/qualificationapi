import { User } from "./user";

export type HeaderAPI = {
  id: number;
  societe: string;
  email: string;
  telephone: string;
  nom: string;
  prenom: string;
  produit: string;
  opportunite: string;
  createur: User;
  gestionnaire: User;
  createdAt?: number;
  updatedAt?: number;
}