import React, { useEffect, useState } from "react";
import { Export } from "@tripetto/runner";
import { RichTreeView } from '@mui/x-tree-view';
import { AnswerAPI } from "../../gec-tripetto";
import formatTripettoAnswers from "../../utils/formatTripettoAnswers";
import displayAnswers from "../../utils/displayAnswers";
import CustomTreeItem from "./CustomTreeItem";

interface VoirReponsesProps {
  answer: AnswerAPI;
  updatedAnswer?: Export.IExportables | null;
}

interface Data {
  id: string;
  node: string;
  label: string;
  children?: Data[];
  disabled?: boolean;
}

const VoirReponses = ({ answer, updatedAnswer }: VoirReponsesProps) => {

  // State: état du composant
  const [reponses, setReponses] = useState<Data[]>([]);
  const [expandItems, setExpandItems] = useState<string[]>([]);

  const getAllItemsWithChildrenItemIds = (rep: Data[]) => {
    const itemIds: string[] = [];
    const registerItemId = (item: Data) => {
      if (item.children?.length) {
        if (!item.disabled) {
          itemIds.push(item.id);
          item.children.forEach(registerItemId);
        }
      }
    };
    reponses.forEach(registerItemId);
    setExpandItems(itemIds);
  };

  // Formattage des réponses
  useEffect(() => {
    const formatReponses = async () => {
      let data: any;
      const formulaire = JSON.parse(answer.formulaire.formulaire);
      const refAnwser = JSON.parse(answer.reponse);
      if (!updatedAnswer) {
        data = await formatTripettoAnswers(formulaire, refAnwser, null);
      } else {
        data = await formatTripettoAnswers(formulaire, updatedAnswer, refAnwser);
      }
      //console.log(data);
      const displayData = await displayAnswers(data);
      //console.log(displayData);
      if (displayData) setReponses(displayData);
    }

    formatReponses();
  }, [answer, updatedAnswer]);
  useEffect(() => {
    getAllItemsWithChildrenItemIds(reponses)
  }, [reponses]);

  // Affichage de la question
  const isDisabled = (item: Data) => {
    return item.disabled ?? false;
  };

  return <RichTreeView
    items={reponses}
    isItemDisabled={isDisabled}
    slots={{ item: CustomTreeItem }}
    expandedItems={expandItems}
  />
}

export default VoirReponses;