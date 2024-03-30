import { FormAPI } from "./formAPI";

export type FormsAPI = {
  data: FormAPI[];
  page: number;
  size: number;
  nombreFormulaires: number;
  hasPrevious: boolean;
  hasNext: boolean;
};
