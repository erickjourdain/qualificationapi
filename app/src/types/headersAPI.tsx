import { HeaderAPI } from "./headerAPI";

export type HeadersAPI = {
  data: HeaderAPI[];
  page: number;
  size: number;
  nbElements: number;
  hasPrevious: boolean;
  hasNext: boolean;
};
