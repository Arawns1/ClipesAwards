import { format } from "date-fns";

export default function dateFormatter(date: Date | string) {
  if (typeof date === "string") {
    date = new Date(date);
  }

  const now = new Date();
  let formatted = "";

  if (date.toDateString() === now.toDateString()) {
    formatted = `hoje às ${format(date, "HH:mm")}`;
  } else if (
    date.toDateString() ===
    new Date(now.setDate(now.getDate() - 1)).toDateString()
  ) {
    formatted = `ontem às ${format(date, "HH:mm")}`;
  } else {
    formatted = format(date, "dd/MM/yyyy HH:mm");
  }

  return formatted;
}
