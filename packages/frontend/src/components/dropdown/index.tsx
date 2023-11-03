import { DropdownProps } from "interface/dropdown";
import { DropDownList, ListItem } from "smart-webcomponents-react/dropdownlist";
import "smart-webcomponents-react/source/styles/smart.default.css";

export default function Dropdown(props: DropdownProps) {
  const { options, onChange, dropDownPosition, selectionMode, className, } =
    props;

  return (
    <div>
      <DropDownList
        onChange={(event) => onChange(event)}
        dropDownPosition={dropDownPosition}
        selectionMode={selectionMode}
        className={className}
      >
        {options.map((item: string) => {
          return <ListItem key={item}>{item}</ListItem>;
        })}
      </DropDownList>
    </div>
  );
}
