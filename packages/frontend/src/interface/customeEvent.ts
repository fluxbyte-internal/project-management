import { KanbanDataSource } from "smart-webcomponents-react";

export interface CustomEvent {
  detail: Detail;
}

export interface Detail {
  label?: string | undefined;
  value?: string | KanbanDataSource | undefined;
  newColumn?: Column;
  column?: Column;
  task?: { 
  data: KanbanDataSource };
  purpose?: string;
}
export interface Column {
  label?: string | undefined;
  value?: string | undefined;
  dataField: string;
}
