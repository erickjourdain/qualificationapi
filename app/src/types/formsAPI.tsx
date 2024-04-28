import { FormAPI } from "./formAPI";

export type FormsAPI = {
  data: FormAPI[];
  page: number;
  size: number;
  nbElements: number;
  hasPrevious: boolean;
  hasNext: boolean;
};
