export default function dateFormater(inputDate: string): string {
  if (!inputDate) {
   return '-'
  } 
  const dateObject = new Date(inputDate);
  const year = dateObject.getUTCFullYear();
  const month = dateObject.getUTCMonth() + 1;
  const day = dateObject.getUTCDate();

  const formattedDate = `${day.toString().padStart(2, "0")}/${month
    .toString()
    .padStart(2, "0")}/${year}`;

  return formattedDate;
}
