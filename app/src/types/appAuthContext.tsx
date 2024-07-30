import { User } from "./user";

export interface AppAuthContext {
//  auth: {
    // token: string | null,
//    isLogged: boolean,
//    isAdmin:boolean,
//    isCreator: boolean,
//  },
  user: User | null;
}
