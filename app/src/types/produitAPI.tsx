import { HeaderAPI } from "./headerAPI";
import { User } from "./user";

export type ProduitAPI = {
  id: number;
  description: string;
  header: HeaderAPI;
  createur: User;
  gestionnaire: User;
  createdAt?: number;
  updatedAt?: number;
}