import { IDefinition } from "@tripetto/runner";
import { User } from "./user";

export type Form = {
  id: number;
  titre: string;
  slug: string;
  description: string | null;
  formulaire?: IDefinition | null;
  createur?: User;
  valide: boolean;
  version: number;
  createdAt?: number;
  updatedAt?: number;
};
