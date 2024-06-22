import React, { useEffect, useState } from "react";
import { Export, IDefinition, Import } from "@tripetto/runner";
import { ClassicRunner } from "@tripetto/runner-classic";
import { ILocale, TTranslation } from "@tripetto/runner/module/l10n";
import translationClassic from "@tripetto/runner-classic/runner/translations/fr.json";
import localeClassic from "@tripetto/runner-classic/runner/locales/fr.json";

type DisplayTripettoProps = {
  form: IDefinition;
  data: Export.IExportables;
  render: boolean;
};

const DisplayTripetto = ({ form, data, render }: DisplayTripettoProps) => {

  const [values, setValues] = useState<Import.IFieldByName[]>([]);

  useEffect(() => {
    const val: Import.IFieldByName[] = [];
    if (data)
      data.fields.forEach((field) => {
        val.push({
          name: field.name,
          value: field.value,
        });
      });
    setValues(val);
  }, [data, render, form]);

  return (
    render &&
    <ClassicRunner
      definition={form}
      locale={localeClassic as unknown as ILocale}
      translations={translationClassic as unknown as TTranslation}
      onImport={(instance) => { Import.fields(instance, values) }}
      customStyle={{
        pointerEvents: "none",
      }}
    />
  )
}

export default DisplayTripetto;