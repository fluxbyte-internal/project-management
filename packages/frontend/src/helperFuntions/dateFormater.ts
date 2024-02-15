export default function dateFormater(inputDate: Date): string {
  const year = inputDate.getFullYear();
  const month = inputDate.getMonth() + 1;
  const day = inputDate.getDate();

  return `${day.toString().padStart(2, '0')}/${month
    .toString()
    .padStart(2, '0')}/${year}`;
}
