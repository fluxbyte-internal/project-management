import Kanban, {
  KanbanDataSource,
  KanbanProps,
} from "smart-webcomponents-react/kanban";
import "./index.css";
import { HTMLAttributes, useRef, useState } from "react";
import { CustomEvent } from "interface/customeEvent";
import KanbanFormView from "../kanbanTaskForm";
import TaskView from "./kanbanTaskView";
import { createRoot } from "react-dom/client";
import { KanbanForm } from "interface/kanbanForm";
function KanbanView(
  props: (HTMLAttributes<Element> & KanbanProps) | undefined
) {
  const [dialogRendered, setDialogRendered] = useState<boolean>(false);
  const [kanbanFormData, setkanbanFormData] = useState<KanbanForm>();

  const childRef = useRef<Kanban>(null);

  const close = () => {
    setDialogRendered(false);
  };

  const checkColumeValue = (event: (Event & CustomEvent) | undefined) => {
    const details = event?.detail;
    if (details?.newColumn && !details.newColumn.label) {
      childRef?.current?.removeColumn(details.newColumn.dataField);
    }
    if (details?.column && !details.column.label) {
      childRef?.current?.removeColumn(details.column.dataField);
    }
  };

  const onTaskRender = (
    taskElement: HTMLElement,
    data: KanbanDataSource & { picture: string | undefined }
  ) => {
    const root = createRoot(taskElement);
    root.render(<TaskView taskData={data} />);
  };

  const onOpening = (e: (Event & CustomEvent) | undefined) => {
    e?.preventDefault();
    const data: KanbanForm = {
      purpose: e?.detail.purpose,
      FormData: e?.detail.task?.data,
      column: e?.detail.column,
    };
    setkanbanFormData(data);
    setDialogRendered(true);
  };

  const heandleTask = (data: KanbanDataSource | undefined) => {
    childRef.current?.addTask(data);
  };
  return (
    <div className="h-full scroll">
      <Kanban
        ref={childRef}
        {...props}
        editable
        onColumnFooterRender={onTaskRender}
        onTaskRender={onTaskRender}
        onColumnUpdate={(e) =>
          checkColumeValue(e as (Event & CustomEvent) | undefined)
        }
        onColumnAdd={(e) =>
          checkColumeValue(e as (Event & CustomEvent) | undefined)
        }
        onOpening={(e) => onOpening(e as (Event & CustomEvent) | undefined)}
      />
      {dialogRendered && (
        <KanbanFormView
          close={close}
          formData={kanbanFormData}
          task={(data) => heandleTask(data)}
        />
      )}
    </div>
  );
}
export default KanbanView;
