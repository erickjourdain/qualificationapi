export type Role = "ADMIN" | "CREATOR" | "CONTRIBUTOR" | "USER";

export type User = {
  id: number;
  nom: string;
  prenom: string;
  login: string;
  password?: string;
  validated: boolean;
  locked: boolean;
  role: Role;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
};
