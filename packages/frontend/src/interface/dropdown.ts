import { FormEvent } from "react";

export interface DropdownProps {
  options: Array<string>;
  onChange: (event: Event | FormEvent<Element> | undefined) => void;
  dropDownPosition: string;
  selectionMode: string;
  className: string;
}
