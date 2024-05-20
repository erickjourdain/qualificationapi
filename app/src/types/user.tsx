export type Role = "ADMIN" | "CREATOR" | "USER" | "READER";

export type User = {
  id: number;
  nom: string;
  prenom: string;
  login: string;
  password?: string;
  validated: boolean;
  locked: boolean;
  resetPwdToken?: string;
  role: Role;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
};
