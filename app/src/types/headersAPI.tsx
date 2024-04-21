import { HeaderAPI } from "./headerAPI";

export type HeadersAPI = {
  data: HeaderAPI[];
  page: number;
  size: number;
  nombreHeaders: number;
  hasPrevious: boolean;
  hasNext: boolean;
};
