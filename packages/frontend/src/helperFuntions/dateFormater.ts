export default function dateFormater(inputDate: string): string {
  const dateObject = new Date(inputDate);
  if (!isNaN(Date.parse(`${dateObject}`))) {
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth() + 1;
    const day = dateObject.getDate();

    return `${day.toString().padStart(2, "0")}/${month
      .toString()
      .padStart(2, "0")}/${year}`;
  } else {
    return "";
  }
}
