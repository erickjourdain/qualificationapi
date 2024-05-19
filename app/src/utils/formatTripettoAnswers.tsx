import { Export,  IDefinition } from "@tripetto/runner";
import { IBranch, ICondition, INode, ISection } from "@tripetto/runner/module/map";

function findReponse(id: string, type: string, reponses: Export.IExportables) {
  let field;
  switch (type) {
    case "multi-select":
    case "checkboxes":
      field = reponses.fields.find((rep) => "index" in rep && rep.slot === id);
      break;
    case "":
      field = null;
      break;
    case "text-area":
    case "text":
    case "email":
    case "yes/no":
    case "date":
    case "dropdown":
      field = reponses.fields.find(
        (rep) => "index" in rep && rep.node.id === id
      );
      break;
    default:
      field = null;
  }
  return field
    ? {
        texte: field.string,
        value:
          field.value ||
          (field.string === "Not selected" || field.string === "Not checked"
            ? false
            : null),
      }
    : null;
}

function loadType(block: any, nodeID: string, reponses: Export.IExportables) {
  if (!block) return null;
  switch (block.type) {
    case "@tripetto/block-multi-select":
      return {
        type: "multi-select",
        options: block.options.map((opt: any) => {
          return {
            id: opt.id,
            libelle: opt.name,
            data: findReponse(opt.id, "multi-select", reponses),
          };
        }),
      };
    case "@tripetto/block-checkboxes":
      return {
        type: "checkboxes",
        options: block.checkboxes.map((checkbox: any) => {
          return {
            id: checkbox.id,
            libelle: checkbox.name,
            data: findReponse(checkbox.id, "checkboxes", reponses),
          };
        }),
      };
    case "@tripetto/block-dropdown":
      return {
        type: "dropdown",
        options: block.options.map((opt: any) => {
          return {
            id: opt.id,
            libelle: opt.name,
          };
        }),
        data: findReponse(nodeID, "dropdown", reponses),
      };
    case "@tripetto/block-textarea":
      return {
        type: "text-area",
        data: findReponse(nodeID, "text-area", reponses),
      };
    case "@tripetto/block-text":
      return {
        type: "text",
        data: findReponse(nodeID, "text", reponses),
      };
    case "@tripetto/block-email":
      return {
        type: "email",
        data: findReponse(nodeID, "email", reponses),
      };
    case "@tripetto/block-yes-no":
      return {
        type: "yes/no",
        data: findReponse(nodeID, "yes/no", reponses),
      };
    case "@tripetto/block-date":
      return {
        type: "date",
        data: findReponse(nodeID, "date", reponses),
      };
    default:
      return null;
  }
}

function loadConditions(conditions: ICondition[], retour: any) {
  return new Promise((resolve) => {
    for (let index = 0; index < conditions.length; index++) {
      const condition = conditions[index];
      switch (condition?.block?.type) {
        case "@tripetto/block-multi-select":
          retour.push({
            type: "multi-select",
            option: condition.block.option,
            selected: condition.block.selected,
            node: condition.block.node,
          });
          break;
        case "@tripetto/block-yes-no:yes":
        case "@tripetto/block-yes-no:no":
          retour.push({
            type: "yes/no",
            selected: condition.block.type.split(":")[1],
            node: condition.block.node,
          });
          break;
        default:
          retour.push(null);
      }
    }
    return resolve(retour);
  });
}

function loadBranches(branches: IBranch[], reponses: Export.IExportables, retour: any, refReponses: Export.IExportables| null) {
  return new Promise(async (resolve) => {
    for (let index = 0; index < branches.length; index++) {
      const branche = branches[index];
      retour.push({
        conditions: branche.conditions
          ? await loadConditions(branche.conditions, [])
          : null,
        sections: branche.sections ? await loadSections(branche.sections, reponses, [], refReponses) : null,
      });
    }
    return resolve(retour);
  });
}

function loadNodes(nodes: INode[], reponses: Export.IExportables, retour: any, refReponses: Export.IExportables| null) {
  return new Promise(async (resolve) => {
    for (let index = 0; index < nodes.length; index++) {
      const node = nodes[index];
      const data = 
      retour.push({
        node: node.id,
        libelle: (node.name !== "") ? node.name : node.description,
        reponse: loadType(node.block, node.id, reponses),
        refReponse: (refReponses) ? loadType(node.block, node.id, refReponses) : undefined,
        branches: (node.branches) ? await loadBranches(node.branches as IBranch[], reponses, [], refReponses) : null,
      });
    }
    return resolve(retour);
  });
}

function loadSections(sections: ISection[], reponses: Export.IExportables, retour: any, refReponses: Export.IExportables| null) {
  return new Promise(async (resolve) => {
    for (let index = 0; index < sections.length; index++) {
      const section = sections[index];
      retour.push({
        section: section.id,
        nodes: section.nodes ? await loadNodes(section.nodes, reponses, [], refReponses) : null,
        branches: section.branches ? await loadBranches(section.branches, reponses, [], refReponses) : null,
      });
    }
    return resolve(retour);
  })
}

const formatTripettoAnswers = async (formulaire: IDefinition, reponses: Export.IExportables, refReponses: Export.IExportables| null) => {
  const questions: any[] = [];
  await loadSections(formulaire.sections, reponses, questions, refReponses);
  return questions;
}

export default formatTripettoAnswers;