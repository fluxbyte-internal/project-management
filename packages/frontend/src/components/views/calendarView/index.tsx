import { Task } from "@/api/mutation/useTaskCreateMutation";
import useAllTaskQuery from "@/api/query/useAllTaskQuery";
import TaskSubTaskForm from "@/components/tasks/taskSubTaskForm";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Scheduler, SchedulerEvent } from "smart-webcomponents-react/scheduler";
import TaskFilter from "../TaskFilter";
import { useUser } from "@/hooks/useUser";
import { FIELDS } from "@/api/types/enums";

function CalendarView() {
  const { projectId } = useParams();
  const allTasks = useAllTaskQuery(projectId);
  const { user } = useUser();
  const [dataSource, setDataSource] = useState<SchedulerEvent[]>();
  const [filterData, setFilterData] = useState<Task[]>();
  const [startDate, setStartDate] = useState<Date>();
  const [dialogRendered, setDialogRendered] = useState<string | undefined>(
    undefined
  );
  const [isTaskShow, setIsTaskShow] = useState<boolean>(false);
  const onItemClick = (e: (Event & CustomEvent) | undefined) => {
    e?.preventDefault();

    if (!e?.detail.item.id) {
      setDialogRendered(undefined), setIsTaskShow(true);
      setStartDate(e?.detail.item.dateStart);
    } else {
      setDialogRendered(e?.detail.item.id);
    }
  };
  useEffect(() => {
    setDataSource(
      allTasks.data?.data.data.map((d) => {
        return DataConvertToScheduler(d);
      })
    );
  }, [allTasks.data?.data.data]);

  useEffect(() => {
    setDataSource(
      filterData?.map((d) => {
        return DataConvertToScheduler(d);
      })
    );
  }, [filterData]);

  const DataConvertToScheduler = (task: Task): SchedulerEvent => {
    return {
      id: task.taskId,
      status: task.status,
      dateStart: task.startDate,
      dateEnd:
        task.milestoneIndicator && task.dueDate
          ? new Date(task.dueDate)
          : new Date(task.endDate),
      label: task.taskName,
      description: task.taskDescription,
      backgroundColor:
        task.flag == "Green"
          ? "#22C55E80"
          : task.flag == "Red"
            ? "#EF444480"
            : task.flag == "Orange"
              ? "#F9980780"
              : "#88888880",
      disableDrag:true,
      disableResize:true,
    };
  };
  const days = [
    { lable: "SUN", value: 0 },
    { lable: "MON", value: 1 },
    { lable: "TUE", value: 2 },
    { lable: "WED", value: 3 },
    { lable: "THU", value: 4 },
    { lable: "FRI", value: 5 },
    { lable: "SAT", value: 6 },
  ];
  const nonWorkingDays = () => {
    const nonworkingDays: (number | undefined)[] = [];
    user?.userOrganisation[0].organisation.nonWorkingDays.forEach((day) => {
      if (day) {
        nonworkingDays.push(days.find((d) => d.lable == day)?.value);
      }
    });
    return nonworkingDays;
  };
  const close = () => {
    setDialogRendered(undefined);
    setIsTaskShow(false);
    setStartDate(undefined);
  };

  return (
    <div className="h-full flex flex-col gap-2">
      <TaskFilter
        fieldToShow={[
          FIELDS.ASSIGNED,
          FIELDS.DATE,
          FIELDS.DUESEVENDAYS,
          FIELDS.FLAGS,
          FIELDS.OVERDUEDAYS,
          FIELDS.TODAYDUEDAYS,
        ]}
        tasks={allTasks.data?.data.data}
        filteredData={(task) => setFilterData(task)}
      />
      <Scheduler
        // ref={scheduler}
        id="scheduler"
        dataSource={dataSource}
        view="month"
        nonworkingDays={nonWorkingDays()}
        draggable={false}
        hideNonworkingWeekdays={true}
        className="h-full"
        onEditDialogOpening={(e) =>
          onItemClick(e as (Event & CustomEvent) | undefined)
        }
      ></Scheduler>
      {(dialogRendered || isTaskShow) && (
        <TaskSubTaskForm
          close={close}
          taskId={dialogRendered ?? undefined}
          projectId={projectId}
          initialValues={{ startDate: startDate }}
        />
      )}
    </div>
  );
}

export default CalendarView;
