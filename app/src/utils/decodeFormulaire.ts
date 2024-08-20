interface Question {
  label: string;
  reponse: string;
}

/**
 * Décodage du formulaire Tripetto pour fourniture des questions et réponses
 * fournies par l'utilisateur
 * 
 * @param iframe HTMLIFrameElement - iframe du questionnaire Tripetto
 * @returns Question[] - tableau des questions / réponses au formulaire
 */
const decodeFormulaire = (iframe: HTMLIFrameElement | null) => {

  const questions: Question[] = [];

  if (iframe) {
    // Contenu de l'iframe
    const innerDoc = iframe.contentDocument;
    if (innerDoc) {
      // Sélection des éléménts Tripetto
      const elements = innerDoc.querySelectorAll("[data-block^='@tripetto']");
      // Boucle sur les éléments
      elements.forEach(function (element) {
        const reponses: (string | null | undefined)[] = [];
        // Type de block Trippetto
        const blockType = element.getAttribute("data-block");
        // Construction de la réponse en fonction du type de block
        switch (blockType) {
          case "@tripetto/block-text":
          case "@tripetto/block-email":
          case "@tripetto/block-date":
            reponses.push(element.querySelector("input")?.getAttribute("value"));
            break;
          case "@tripetto/block-textarea":
            reponses.push(element.querySelector("textarea")?.textContent);
            break;
          case "@tripetto/block-yes-no":
            element.querySelectorAll("button")
              .forEach(function (btn) {
                if (window.getComputedStyle(btn).backgroundColor !== "transparent" &&
                  window.getComputedStyle(btn).backgroundColor !== "rgba(0, 0, 0, 0)")
                  reponses.push(btn.textContent);
              });
            break;
          case "@tripetto/block-multi-select":
            element.querySelectorAll("div[role='combobox'] span")
              .forEach(function (cmb) {
                reponses.push(cmb.textContent);
              });
            break;
          case "@tripetto/block-dropdown":
            reponses.push(element.querySelector("select option")?.textContent);
            break;
          case "@tripetto/block-checkboxes":
            element.querySelectorAll("input[type=checkbox]:checked")
              .forEach(function (cbx) {
                reponses.push(cbx.nextElementSibling?.textContent);
              });
            break;
          case "@tripetto/block-radiobuttons":
            element.querySelectorAll("input[type=radio]:checked")
              .forEach(function (rdb) {
                reponses.push(rdb.nextElementSibling?.textContent);
              });
            break;
          default:
        }
        // Ajout de la question et de la réponse dans le tableau de retour
        questions.push({
          label: element.firstElementChild?.textContent || "NA",
          reponse: reponses.join("; "),
        })
      })
    }
  }

  // retour du tableau des questions / réponses
  return questions;
}

export default decodeFormulaire;