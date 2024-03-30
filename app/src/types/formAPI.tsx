
import { User } from "./user";

export type FormAPI = {
  id: number;
  titre: string;
  slug: string;
  description: string | null;
  formulaire: string;
  createur: User;
  valide: boolean;
  version: number;
  createdAt?: number;
  updatedAt?: number;
};
