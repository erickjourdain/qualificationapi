import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { Export, IDefinition, Import } from "@tripetto/runner";
import { ClassicRunner } from "@tripetto/runner-classic";
import { ILocale, TTranslation } from "@tripetto/runner/module/l10n";
import translationClassic from "@tripetto/runner-classic/runner/translations/fr.json";
import localeClassic from "@tripetto/runner-classic/runner/locales/fr.json";
import { stylesTripetto } from "@/stores/mainStore";
import Loading from "@/components/Loading";

interface DisplayTripettoProps {
  form: IDefinition;
  data: Export.IExportables;
  render: boolean;
}

const DisplayTripetto = ({ form, data, render }: DisplayTripettoProps) => {
  // Chargement du style de visualisation du formulaire
  const styles = useAtomValue(stylesTripetto);
  // Etat local des réponses au formulaire
  const [values, setValues] = useState<Import.IFieldByName[]>([]);

  // Mise à jour des réponses au formulaire
  useEffect(() => {
    setValues([]);
    const val: Import.IFieldByName[] = [];
    if (render)
      for (let index = 0; index < data.fields.length; index++) {
        val.push({
          name: data.fields[index].name,
          value: data.fields[index].value,
        });
      }
    setValues(val);
  }, [data, render, form]);

  if (!render) return <Loading />;

  if (render)
    return (
      <ClassicRunner
        definition={form}
        locale={localeClassic as unknown as ILocale}
        translations={translationClassic as unknown as TTranslation}
        onImport={(instance) => {
          Import.fields(instance, values);
        }}
        customStyle={{
          pointerEvents: "none",
        }}
        styles={styles}
      />
    );
};

export default DisplayTripetto;
