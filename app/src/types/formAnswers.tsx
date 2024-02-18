import { TSerializeTypes } from "@tripetto/runner";

export type Answer = {
  dataType: string;
  name: string;
  string: string;
  value: TSerializeTypes;
}

export type FormAnswers = {
  id: string;
  question: string;
  type: string;
  reponses: Answer[];
};
