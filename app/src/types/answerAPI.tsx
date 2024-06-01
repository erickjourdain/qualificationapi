import { FormAPI } from "./formAPI";
import { User } from "./user";
import { LockAPI } from "./lockAPI";
import { Statut } from "./statuts";
import { DevisAPI } from "./devisAPI";

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
  devis: DevisAPI | null;
  lock: LockAPI;
  createdAt?: number;
  updatedAt?: number;
};
