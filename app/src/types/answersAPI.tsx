import { AnswerAPI } from "./answerAPI";

export type AnswersAPI = {
  data: AnswerAPI[];
  page: number;
  size: number;
  nbElements: number;
  hasPrevious: boolean;
  hasNext: boolean;
};
