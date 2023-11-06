import KanbanFormView from "../kanbanTaskForm";
import { useState } from "react";
import { Scheduler, SchedulerProps } from "smart-webcomponents-react/scheduler";
function CalenderView(props: SchedulerProps) {
  const [dialogRendered, setDialogRendered,] = useState<boolean>(false);
  const [kanbanFormData, setkanbanFormData,] = useState<
    (Event & CustomEvent) | undefined
  >();
  const open = (e: (Event & CustomEvent) | undefined) => {
    setkanbanFormData(e);
    setDialogRendered(true);
  };
  const onOpening = (e: (Event & CustomEvent) | undefined) => {
    e?.preventDefault();
    open(e as (Event & CustomEvent) | undefined);
  };

  const close = () => {
    setDialogRendered(false);
    setkanbanFormData(undefined);
  };
  const task = () => {};
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
