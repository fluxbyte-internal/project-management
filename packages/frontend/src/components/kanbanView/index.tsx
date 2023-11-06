import Kanban, {
  KanbanDataSource,
  KanbanProps
} from "smart-webcomponents-react/kanban";
import "./index.css";
import { HTMLAttributes, useEffect, useRef, useState } from "react";
import { CustomEvent } from "interface/customeEvent";
import KanbanFormView from "../kanbanTaskForm";
import TaskView from "./kanbanTaskView";
import { createRoot } from "react-dom/client";
function KanbanView(
  props: (HTMLAttributes<Element> & KanbanProps) | undefined
) {
  const [dialogRendered, setDialogRendered,] = useState<boolean>(false);
  const [kanbanFormData, setkanbanFormData,] = useState<
    (Event & CustomEvent) | undefined
  >();
  const [kanbanProps, setkanbanProps,] = useState<
    (HTMLAttributes<Element> & KanbanProps) | undefined
  >();
  const childRef = useRef<Kanban>(null);

  useEffect(() => {
    setkanbanProps(props);
  }, [props,]);

  const open = (data: (Event & CustomEvent) | undefined) => {
    setkanbanFormData(data);
    setDialogRendered(true);
  };

  const close = () => {
    setDialogRendered(false);
  };

  const chackColumeValue = (event: (Event & CustomEvent) | undefined) => {
    const details = event?.detail;
    if (details?.newColumn && !details.newColumn.label) {
      childRef?.current?.removeColumn(details.newColumn.dataField);
    }
    if (details?.column && !details.column.label) {
      childRef?.current?.removeColumn(details.column.dataField);
    }
  };


  const onTaskRender = (taskElement: HTMLElement, data: KanbanDataSource) => {
    const root = createRoot(taskElement);
    root.render(<TaskView taskData={data as KanbanDataSource&{picture :string|undefined}} />);
  };

  const onTaskAdd = (e: (Event & CustomEvent) | undefined) => {
    e?.preventDefault();
  };

  const onOpening = (e: (Event & CustomEvent) | undefined) => {
    e?.preventDefault();
    open(e as (Event & CustomEvent) | undefined);
  };

  const heandleTask = (data:KanbanDataSource|undefined) =>{
    childRef.current?.addTask(data);
  };
  return (
    <div className="h-full scroll">
      <Kanban
        ref={childRef}
        {...kanbanProps}
        editable
        onTaskRender={onTaskRender}
        onColumnUpdate={(e) =>
          chackColumeValue(e as (Event & CustomEvent) | undefined)
        }
        onColumnAdd={(e) =>
          chackColumeValue(e as (Event & CustomEvent) | undefined)
        }
        onTaskAdd={(e) => {
          onTaskAdd(e as (Event & CustomEvent) | undefined);
        }}
        onOpening={(e) => onOpening(e as (Event & CustomEvent) | undefined)}
      />
      {dialogRendered && (
        <KanbanFormView close={close} formData={kanbanFormData} task={(data)=>heandleTask(data)} />
      )}
    </div>
  );
}
export default KanbanView;
