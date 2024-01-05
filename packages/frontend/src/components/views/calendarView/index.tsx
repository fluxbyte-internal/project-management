import { Task } from "@/api/mutation/useTaskCreateMutation";
import useAllTaskQuery from "@/api/query/useAllTaskQuery";
import TaskSubTaskForm from "@/components/tasks/taskSubTaskForm";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Scheduler, SchedulerEvent } from "smart-webcomponents-react/scheduler";

function CalendarView() {
  const { projectId } = useParams();
  const allTasks = useAllTaskQuery(projectId);

  const [dataSource, setDataSource] = useState<SchedulerEvent[]>();
  const [dialogRendered, setDialogRendered] = useState<string | undefined>(
    undefined
  );
  const [isTaskShow, setIsTaskShow] = useState<boolean>(false);
  const onItemClick = (e: (Event & CustomEvent) | undefined) => {
    e?.preventDefault();
    if (e?.detail.purpose === "add") {
      setDialogRendered(undefined), setIsTaskShow(true);
    } else {
      setDialogRendered(e?.detail.task.data.id);
    }
  };
  useEffect(() => {
    setDataSource(
      allTasks.data?.data.data.map((d) => {
        return DataConvertToScheduler(d);
      })
    );
  }, []);
  const DataConvertToScheduler = (task: Task): SchedulerEvent => {
    return {
      id: task.taskId,
      color: task.flag,
      status: task.status,
      dateStart: task.startDate,
      dateEnd:task.endDate,
      label:task.taskName,
    };
  };
  return (
    <div>
      <Scheduler
        // ref={scheduler}
        id="scheduler"
        dataSource={dataSource}
        // view={view}
        // views={views}
        // nonworkingDays={nonworkingDays}
        // firstDayOfWeek={firstDayOfWeek}
        // disableDateMenu={disableDateMenu}
        // currentTimeIndicator={currentTimeIndicator}
        // scrollButtonsPosition={scrollButtonsPosition}
        // onDragEnd={updateData}
        // onResizeEnd={updateData}
        // onItemUpdate={updateData}
        // onItemRemove={updateData}
        // onDateChange={handleDateChange}
        className="!h-full"
        onEditDialogOpen={(e) =>
          onItemClick(e as (Event & CustomEvent) | undefined)
        }
      ></Scheduler>
      {(dialogRendered || isTaskShow) && (
        <TaskSubTaskForm
          close={close}
          taskId={dialogRendered ?? undefined}
          projectId={projectId}
        />
      )}
    </div>
  );
}

export default CalendarView;
