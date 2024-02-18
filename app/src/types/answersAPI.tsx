import { AnswerAPI } from "./answerAPI";

export type AnswersAPI = {
  data: AnswerAPI[];
  page: number;
  size: number;
  nombreFormulaires: number;
  hasPrevious: boolean;
  hasNext: boolean;
};
