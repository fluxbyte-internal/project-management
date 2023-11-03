export interface CustomEvent {
  detail: Detail;
}

interface Detail {
  label?: string | undefined;
  value?: string | undefined;
  newColumn?:NewColumn
  column?:NewColumn

}
interface NewColumn{
  label?: string | undefined;
  value?: string | undefined;
  dataField: string;
}

