import { FormAPI } from "./formAPI";
import { User } from "./user";
import { LockAPI } from "./lockAPI";
import { Statut } from "./statuts";

export type AnswerAPI = {
  id: number;
  uuid: string;
  formulaire: FormAPI;
  reponse: string;
  createur: User;
  gestionnaire: User;
  statut: Statut;
  version: number;
  courante: boolean;
  devis: number;
  lock: LockAPI;
  createdAt?: number;
  updatedAt?: number;
};
