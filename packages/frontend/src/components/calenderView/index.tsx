import { KanbanForm } from "interface/kanbanForm";
import KanbanFormView from "../kanbanTaskForm";
import { useState } from "react";
import { Scheduler, SchedulerProps } from "smart-webcomponents-react/scheduler";
function CalenderView(props: SchedulerProps) {
  const [dialogRendered, setDialogRendered] = useState<boolean>(false);
  const [kanbanFormData, setkanbanFormData] = useState<KanbanForm>();

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

  const close = () => {
    setDialogRendered(false);
    setkanbanFormData(undefined);
  };
  const task = () => {
    console.log("task create");
  };
  return (
    <div className="h-full w-full">
      <Scheduler
        id="scheduler"
        dataSource={props.dataSource}
        onEditDialogOpening={(e) =>
          onOpening(e as (Event & CustomEvent) | undefined)
        }
      />
      {dialogRendered && (
        <KanbanFormView formData={kanbanFormData} close={close} task={task} />
      )}
    </div>
  );
}

export default CalenderView;
