import { Export } from "@tripetto/runner";
import { DateTimeFormatOptions } from "luxon";
import lodash, { filter } from "lodash";
import deepdash from "deepdash";
import { findIndex, get, has } from "lodash";
import { Form, FormAnswers } from "gec-tripetto";

const _ = deepdash(lodash);

// conversion au format français de date et heure
const formatDateTime = (date: number | undefined) => {
  const event = date ? new Date(date) : null;
  const options: DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
  return event ? event.toLocaleDateString("fr-FR", options) : "";
  // return value ? value.toLocaleString(DateTime.DATE_MED, { locale: "fr-fr" }) : "";
};

// conversion au format français de date
const formatDate = (date: number | undefined) => {
  const event = date ? new Date(date) : null;
  const options: DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" };
  return event ? event.toLocaleDateString("fr-FR", options) : "";
  // return value ? value.toLocaleString(DateTime.DATE_MED, { locale: "fr-fr" }) : "";
};

const formTripettoAnswers = (form: Form, exportables: Export.IExportables) => {
  const data: FormAnswers[] = [];
  // boucle sur les réponses pour récupérer les différentes questions
  exportables.fields.forEach((field) => {
    // recherche de l'identifiant de la question dans le tableau des résultats
    const ind = findIndex(data, { id: field.node.id });
    if (ind < 0) {
      // création d'une nouvelle entrée
      // recherche de la question liée à la réponse dans le formulaire
      const deepPath = _.findPathDeep(form, (value, key) => {
        return key === "id" && value === field.node.id;
      }) as string;
      data.push({
        id: field.node.id,
        question: get(form, deepPath.replace(".id", ".name")) || get(form, deepPath.replace(".id", ".description")),
        type: field.type,
        reponses: [],
      });
    }
  });
  data.forEach((rep: FormAnswers) => {
    const reponses = filter(exportables.fields, (field) => field.node.id === rep.id);
    reponses.forEach(r => {
      if (has(r, "value") && r.value !== undefined) {
        rep.reponses.push({
          dataType: r.datatype,
          name: r.name,
          string: r.string,
          value: r.value,
        });
    }});
  });
  return data;
}

export { formatDate, formatDateTime, formTripettoAnswers };
