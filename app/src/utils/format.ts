import { DateTimeFormatOptions } from "luxon";

// conversion au format français de date et heure
const formatDateTime = (date: number | undefined) => {
  const event = date ? new Date(date) : null;
  const options: DateTimeFormatOptions = {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };
  return event ? event.toLocaleString("fr-FR", options) : "";
  // return value ? value.toLocaleString(DateTime.DATE_MED, { locale: "fr-fr" }) : "";
};

// conversion au format français de date
const formatDate = (date: number | undefined) => {
  const event = date ? new Date(date) : null;
  const options: DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return event ? event.toLocaleDateString("fr-FR", options) : "";
  // return value ? value.toLocaleString(DateTime.DATE_MED, { locale: "fr-fr" }) : "";
};

export { formatDate, formatDateTime };
