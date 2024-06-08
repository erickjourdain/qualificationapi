import { User } from "./user";

export type DevisAPI = {
  id: number;
  reference: string;
  createur: User;
  createdAt?: number;
}