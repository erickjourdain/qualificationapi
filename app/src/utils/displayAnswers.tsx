import { v4 as uuidv4 } from 'uuid';

interface Data {
  id: string;
  node: string;
  label: string;
  children?: Data[];
  disabled?: boolean;
}

function loadSections(sections: any, retour: any) {
  return new Promise(async (resolve) => {
    for (let index = 0; index < sections.length; index++) {
      const section = sections[index];
      if (section.nodes) await loadSection(section, retour);
    }
    return resolve(retour);
  });
}

function loadChildrens(branches: any, retour: any) {
  return new Promise<Data[]>(async (resolve) => {
    for (let index = 0; index < branches.length; index++) {
      const branche = branches[index];
      if (branche.sections) await loadSections(branche.sections, retour);
    }
    return resolve(retour);
  });
}

function loadReponses(node: any, field: string):Promise<string> {
  return new Promise((resolve) => {
    switch (node[field].type) {
      case "text":
      case "text-area":
      case "yes/no":
      case "email":
      case "dropdown":
      case "date":
        return resolve(node[field].data.texte);
      case "multi-select":
      case "checkboxes":
        const selection = node[field].options.filter(
          (option: any) => option.data.value
        );
        return resolve(selection
          ? selection.map((option: any) => option.libelle).join(" - ")
          : "");
      default:
        return resolve("????????????????");
    }
  });
}

function loadSection(section: any, retour: any) {
  return new Promise(async (resolve) => {
    for (let index = 0; index < section.nodes.length; index++) {
      const node = section.nodes[index];
      let reponse = null as null | string;
      let refResponse = undefined as undefined | null | string;
      if (node.reponse) reponse = await loadReponses(node, 'reponse');
      if (node.refReponse !== undefined) refResponse = (node.refReponse) ? await loadReponses(node, 'refReponse') : node.refReponse;
      const data: Data = {
        id: uuidv4(),
        node: node.node,
        label: (refResponse === undefined) ? `${node.libelle}|${reponse}` : `${node.libelle}|${reponse}|${refResponse}`,
        disabled: (reponse === null) || (reponse.length === 0)
      };
      if (section.branches) data.children = await loadChildrens(section.branches, []);
      retour.push(data);
    }
    return resolve(retour);
  });
}

const displayAnswers = async (data: any) => {
  return new Promise<Data[]>(async (resolve) => {
    const retour: Data[] = [];
    for (let index = 0; index < data.length; index++) {
      const section = data[index];
      await loadSection(section, retour);
    }
    return resolve(retour);
  })
}

export default displayAnswers;