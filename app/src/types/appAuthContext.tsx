import { User } from "./user";

export interface AppAuthContext {
  user: User | null;
  isLogged: boolean;
  isAdmin: boolean;
  isCreator: boolean;
  isUser: boolean;
  login: (user: User) => void;
  logout: () => void;
}
