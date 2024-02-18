import { utils, writeFileXLSX } from "xlsx";
import { sfEqual } from "spring-filter-query-builder";
import { Answer, AnswersAPI } from "gec-tripetto";
import { getAnswers } from "./apiCall";
import { formTripettoAnswers } from "./format";

const reponseString = (values: Answer[]) => {
  if (values.length === 1) {
    let val: string | number | Date = "";
    if (!values[0].value) return val;
    switch (values[0].dataType) {
      case "date":
        val = new Date(values[0].value as number);
        break;
      case "number":
        val = values[0].value as number;
      default:
        val = values[0].value as string;
        break;
    }
    return val;
  } else {
    const data = values.filter((val) => val.value).map((val) => {
      if (val.value) return val.name;
    });
    return `${data.join(" - ")}`;
  }
};

const transpose = (a: (string | number | Date)[][]) => {
  {
    // Calculate the width and height of the Array
    var w = a.length || 0;
    var h = a[0] instanceof Array ? a[0].length : 0;

    // In case it is a zero matrix, no transpose routine needed.
    if (h === 0 || w === 0) {
      return [];
    }

    /**
     * @var {Number} i Counter
     * @var {Number} j Counter
     * @var {Array} t Transposed data is stored in this array.
     */
    let i: number;
    let j: number;
    const t: (string | number | Date)[][] = [];

    // Loop through every item in the outer array (height)
    for (i = 0; i < h; i++) {
      // Insert a new row (array)
      t[i] = [];

      // Loop through every item per item in outer array (width)
      for (j = 0; j < w; j++) {
        // Save transposed data.
        t[i][j] = a[j][i];
      }
    }

    return t;
  }
};

export default (uuid: string) => {
  return new Promise(async (resolve, reject) => {
    const size = 10;
    //const ws = utils.json_to_sheet([]);
    const firstRow = ["version", "créateur", "créé le", "gestionnaire", "mis à jour le", "statut", "demande", "opportunité"];
    const rows: (string | number | Date)[][] = [];
    let moreData = true;
    let page = 0;
    do {
      try {
        page++;
        const filters = sfEqual("uuid", uuid);
        const rep = await getAnswers(`filter=${filters}&page=${page}&size=${size}&orderBy=id(asc)`);
        const data = rep.data as AnswersAPI;
        for (let i = 0; i < data.data.length; i++) {
          const row: (string | number | Date)[] = [];
          let date: Date;
          const formattedData = formTripettoAnswers(JSON.parse(data.data[i].formulaire.formulaire), JSON.parse(data.data[i].reponse));
          const col = i + 1 + (page - 1) * size;
          row.push(data.data[i].version);
          row.push(`${data.data[i].createur.prenom} ${data.data[i].createur.nom}`);
          date = new Date(data.data[i].createdAt as number);
          row.push(date);
          row.push(`${data.data[i].gestionnaire.prenom} ${data.data[i].gestionnaire.nom}`);
          date = new Date(data.data[i].updatedAt as number);
          row.push(date);
          row.push(data.data[i].statut);
          row.push(data.data[i].demande ? `DEM${data.data[i].demande}` : "");
          row.push(data.data[i].opportunite ? `DEM${data.data[i].opportunite}` : "");
          for (let j = 0; j < formattedData.length; j++) {
            if (i === 0 && page === 1) {
              const question = formattedData[j].question ? formattedData[j].question : formattedData[j].reponses[0].name;
              firstRow.push(question);
            }
            row.push(reponseString(formattedData[j].reponses));
          }
          if (i === 0 && page === 1) rows.push(firstRow);
          rows.push(row);
        }
        moreData = data.hasNext;
      } catch (err) {
        return reject(err);
      }
    } while (moreData);
    const ws = utils.aoa_to_sheet(transpose(rows));
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "donnees");
    writeFileXLSX(wb, "Qualification.xlsx", { compression: true });
    return resolve(true);
  });
};
