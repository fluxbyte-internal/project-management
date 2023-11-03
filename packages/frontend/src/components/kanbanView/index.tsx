// import KanbarnForm from "../../components/kanbanForm";
import Kanban, { KanbanProps } from "smart-webcomponents-react/kanban";
import "./index.css";
import { HTMLAttributes, useEffect, useRef, useState } from "react";
// import { customEvent } from "interface/customeEvent";
import { CustomEvent } from "interface/customeEvent";
function KanbanView(
  props: (HTMLAttributes<Element> & KanbanProps) | undefined
) {
  const [kanbanProps, setkanbanProps,] = useState<
    (HTMLAttributes<Element> & KanbanProps) | undefined
  >();
  useEffect(() => {
    setkanbanProps(props);
  }, [props,]);

  // const onTaskRender = (task: any, data: KanbanDataSource) => {
  //   let color = "";
  //   switch (data.status) {
  //     case "toDo": {
  //       color = "#0B88DA";
  //       break;
  //     }
  //     case "Vincent van Gogh": {
  //       color = "#30C1E3";
  //       break;
  //     }
  //     case "Edgar Degas": {
  //       color = "#34C8BA";
  //       break;
  //     }
  //     case "Shen Zhou": {
  //       color = "#0D559D";
  //       break;
  //     }
  //     case "Ivan Milev": {
  //       color = "#39AD69";
  //       break;
  //     }
  //   }
  //   task.style.background = color;
  //   task.style.color = "#000";
  // };
  // const dialogRendered = (
  //   dialog: any,
  //   editors: any,
  //   labels: any,
  //   tabs: any,
  //   layout: any
  // ) => {
  //   // hides the tabs in the kanban.
  //   // tabs['all'].style.display = 'none';

  //   // the editors layout. By default it is in 2 columns and uses Grid layout. We set it to block in order to make it to occupy the full width.
  //   layout.style.display = "block";

  //   // the following editors would be hidden.
  //   for (const key in dialog.editors) {
  //     switch (key) {
  //     case "progress":
  //     case "startDate":
  //     case "color":
  //     case "priority":
  //     case "userId":
  //     case "dueDate":
  //     case "tags":
  //     case "checklist": {
  //       // editors[key].style.display = 'none';
  //       // labels[key].style.display = 'none';
  //       // break;
  //     }
  //     }
  //   }
  // };

  // useImperativeHandle(ref, () => ({

  //   removeColumn (dataField: string | undefined) {
  //     console.log(dataField);
  //     kanban.props.removeColumn(dataField as string);
  //   }

  // }));
  // const kanban = React.createElement(Kanban, { ...kanbanProps });
  const childRef = useRef<Kanban>(null);

  const chackColumeValue = (event: (Event & CustomEvent) | undefined) => {
    const details = event?.detail;

    if(details?.newColumn && !details.newColumn.label){
      childRef?.current?.removeColumn(details.newColumn.dataField);
    }
    
    if(details?.column && !details.column.label){
      childRef?.current?.removeColumn(details.column.dataField);
    }
  };

  return (
    <div className="h-full">
      {/* {kanban} */}
      <Kanban ref={childRef} {...kanbanProps} onColumnUpdate={(e)=>chackColumeValue(e as (Event & CustomEvent) | undefined)} onColumnAdd={(e)=>chackColumeValue(e as (Event & CustomEvent) | undefined)} />
    </div>
  );
}
export default KanbanView;
