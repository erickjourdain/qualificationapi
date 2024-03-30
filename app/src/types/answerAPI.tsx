import { FormAPI } from "./formAPI";
import { User } from "./user";
import { LockAPI } from "./lockAPI";

export type AnswerAPI = {
  id: number;
  uuid: string;
  formulaire: FormAPI;
  reponse: string;
  createur: User;
  gestionnaire: User;
  demande: number | null;
  opportunite: number | null;
  statut: string;
  version: number;
  courante: boolean;
  lock: LockAPI;
  createdAt?: number;
  updatedAt?: number;
};
