import { User } from "./user"

export type UsersAPI = {
  data: User[];
  page: number;
  size: number;
  nbElements: number;
  hasPrevious: boolean;
  hasNext: boolean;
}