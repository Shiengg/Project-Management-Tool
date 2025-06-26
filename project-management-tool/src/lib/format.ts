export const formatDate = (date: Date | string) => {
  const dateObject = typeof date === "string" ? new Date(date) : date;
  return dateObject.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDateOnly = (date: Date | string) => {
  const dateObject = typeof date === "string" ? new Date(date) : date;
  return dateObject.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatDateTimeLocal = (date: Date | string) => {
  if(!date) return "";
  const d = new Date(date);
  const pad = (n: number) => String(n).padStart(2, "0");

  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};
