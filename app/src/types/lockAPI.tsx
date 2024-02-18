import { User } from "./user";

export type LockAPI = {
  id: number;
  lockedAt: number;
  utilisateur: User;
}