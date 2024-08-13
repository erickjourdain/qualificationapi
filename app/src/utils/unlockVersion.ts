import { unlockAnswer } from "./apiCall";

interface Selection {
  produit: number;
  formulaire: number | null;
  version: number | null | undefined;
  versionLocked: boolean;
}

const unlockVersion = async (selection: Selection) => {
  if (selection.version && selection.versionLocked) {
    await unlockAnswer(selection.version);
  }
};

export default unlockVersion;
