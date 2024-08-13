import { useAtom, useAtomValue } from "jotai";
import { Export, IDefinition, Import, Instance } from "@tripetto/runner";
import { ChatRunner } from "@tripetto/runner-chat";
import { AutoscrollRunner } from "@tripetto/runner-autoscroll";
import { ClassicRunner } from "@tripetto/runner-classic";
import localeClassic from "@tripetto/runner-classic/runner/locales/fr.json";
import localeChat from "@tripetto/runner-chat/runner/locales/fr.json";
import localeAutoScroll from "@tripetto/runner-autoscroll/runner/locales/fr.json";
import translationClassic from "@tripetto/runner-classic/runner/translations/fr.json";
import translationChat from "@tripetto/runner-chat/runner/translations/fr.json";
import translationAutoScroll from "@tripetto/runner-autoscroll/runner/translations/fr.json";
import { ILocale, TTranslation } from "@tripetto/runner/module/l10n";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { runnerAtom, stylesTripetto } from "@/stores/mainStore";

type TripettoProps = {
  open: boolean;
  onClose: () => void;
  form: IDefinition;
  data?: Export.IExportables;
  onSubmit?: (instance: Instance) => boolean;
};

const PlayTripetto = ({
  open,
  onClose,
  form,
  data,
  onSubmit,
}: TripettoProps) => {
  let runner: JSX.Element;

  // Chargement de l'état Atom du runner
  const [tripettoRunner] = useAtom(runnerAtom);
  // Chargement du style de visualisation du formulaire
  const styles = useAtomValue(stylesTripetto);

  const onImport = (instance: Instance) => {
    const values: Import.IFieldByName[] = [];
    if (data)
      data.fields.forEach((field) => {
        values.push({
          name: field.name,
          value: field.value,
        });
      });
    Import.fields(instance, values);
  };

  // choix du type de formulaire
  switch (tripettoRunner) {
    case "Chat":
      runner = (
        <ChatRunner
          definition={form}
          locale={localeChat as unknown as ILocale}
          translations={translationChat as unknown as TTranslation}
          styles={styles}
          onImport={onImport}
          onSubmit={onSubmit}
        />
      );
      break;
    case "Autoscroll":
      runner = (
        <AutoscrollRunner
          definition={form}
          locale={localeAutoScroll as unknown as ILocale}
          translations={translationAutoScroll as unknown as TTranslation}
          styles={styles}
          onImport={onImport}
          onSubmit={onSubmit}
        />
      );
      break;
    case "Classic":
    default:
      runner = (
        <ClassicRunner
          definition={form}
          locale={localeClassic as unknown as ILocale}
          translations={translationClassic as unknown as TTranslation}
          styles={styles}
          onImport={onImport}
          onSubmit={onSubmit}
        />
      );
      break;
  }

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="md"
      onClose={onClose}
      scroll="paper"
    >
      <DialogTitle>Formulaire Qualification</DialogTitle>
      <DialogContent dividers>
        <DialogContentText sx={{ width: "90%" }}>{runner}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlayTripetto;
