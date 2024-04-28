import { ProduitAPI } from "./produitAPI"

export type ProduitsAPI = {
  data: ProduitAPI[];
  page: number;
  size: number;
  nbElements: number;
  hasPrevious: boolean;
  hasNext: boolean;
}