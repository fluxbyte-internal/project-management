import { useEffect, useRef, useState } from "react";
import GanttChart from "smart-webcomponents-react/ganttchart";
import { useParams } from "react-router-dom";
import Select, { SingleValue } from "react-select";
import useAllTaskQuery from "@/api/query/useAllTaskQuery";
import "./SmartElement.css";
import useUpdateTaskMutation from "@/api/mutation/useTaskUpdateMutation";
import { toast } from "react-toastify";
import { useUser } from "@/hooks/useUser";
import TaskDependencies from "../../tasks/taskDependencies";
import { Task } from "@/api/mutation/useTaskCreateMutation";
import Dialog from "../../common/Dialog";
import CrossSvg from "@/assets/svg/CrossIcon.svg";
import { Button } from "../../ui/button";
import TaskFilter, { TaskFilterRef } from "../TaskFilter";
import TaskSubTaskForm from "@/components/tasks/taskSubTaskForm";
import TrashCan from "@/assets/svg/TrashCan.svg";
import Edit from "@/assets/svg/EditPen.svg";
import useRemoveTaskMutation from "@/api/mutation/useTaskRemove";
import UserAvatar from "@/components/ui/userAvatar";
import { UserOrganisationType } from "@/api/query/useOrganisationDetailsQuery";
import ReactDOMServer from "react-dom/server";
import {
  GanttChartTask,
  GanttChartTaskColumn,
} from "smart-webcomponents-react/ganttchart";
import addIcon from "@/assets/svg/AddProjectIcon.svg";
import { FIELDS } from "@/api/types/enums";
import { Progress } from "@/components/ui/progress";
export interface Options {
  label: string;
  value: string;
}
enum BUTTON_EVENT {
  EDIT = "EDIT",
  REMOVE = "REMOVE",
}
const reactSelectStyle = {
  control: (
    provided: Record<string, unknown>,
    state: { isFocused: boolean }
  ) => ({
    ...provided,
    border: "1px solid #E7E7E7",
    outline: state.isFocused ? "2px solid #943B0C" : "1px solid #E7E7E7",
    boxShadow: state.isFocused ? "0px 0px 0px #943B0C" : "none",
    "&:hover": {
      outline: state.isFocused ? "2px solid #943B0C" : "1px solid #E7E7E7",
      boxShadow: "0px 0px 0px #943B0C",
    },
  }),
} as const;

function GanttView() {
  const treeSize = "35%";
  const durationUnit = "day";
  const sortMode = "many";
  const showProgressLabel = true;
  const { projectId } = useParams();
  const [filterUnit, setFilterUnit] = useState<string>("month");
  const ganttChart = useRef<GanttChart>(null);
  const { user } = useUser();
  const allTaskQuery = useAllTaskQuery(projectId);
  const taskUpdateMutation = useUpdateTaskMutation();
  const [filterData, setFilterData] = useState<Task[]>();
  const [taskRemove, setTaskRemove] = useState("");
  const [taskEdit, setTaskEdit] = useState("");
  const [taskId, setTaskId] = useState<string>();
  const [isTaskOpen, setIsTaskOpen] = useState<boolean>(false);
  const [taskData, setTaskData] = useState<GanttChartTask[]>();
  const tooltip = {
    enabled: true,
  };

  const filterRef = useRef<TaskFilterRef | null>(null);
  useEffect(() => {
    setFilterData(allTaskQuery.data?.data.data);
    ganttChart.current?.refresh();
    filterRef.current?.callFilter();
  }, [allTaskQuery.data?.data.data, projectId]);

  useEffect(() => {
    if (filterData) {
      filterData.forEach((task) => {
        task.subtasks = filterData.filter(
          (subtask) => subtask.parentTaskId === task.taskId
        );
      });
      const topLevelTasks = filterData.filter(
        (task) => task.parentTaskId === null
      );
      const convertedData = topLevelTasks.map((task) => convertTask(task));
      convertedData.push({
        id: "",
        value: "false",
        label: "add task",
        dateStart: new Date(),
        dateEnd: new Date(),
      });
      setTaskData(convertedData);
    }
  }, [filterData, filterUnit]);

  const convertTask = (originalTask: Task) => {
    const convertedTask: GanttChartTask = {
      id: originalTask.taskId,
      label: originalTask.taskName,
      dateStart: originalTask.startDate,
      dateEnd: originalTask.endDate,
      disableResources: true,
      resources: [{ id: JSON.stringify(originalTask.assignedUsers) }],
      tasks: [],
      progress: originalTask.completionPecentage
        ? Number(originalTask.completionPecentage)
        : 0,
      connections:
        originalTask.dependencies && originalTask.dependencies.length > 0
          ? connections(originalTask)
          : null,
      type: originalTask.milestoneIndicator ? "milestone" : "task",
    };

    if (originalTask.subtasks) {
      convertedTask.tasks = originalTask.subtasks.map((subtask) =>
        convertTask(subtask)
      );
      convertedTask.tasks.push({
        id: convertedTask.id,
        value: "false",
        disableResources: false,
      });
    }

    return convertedTask;
  };

  const connections = (originalTask: Task) => {
    return originalTask.dependencies.map((dependence) => {
      return {
        target: dependence.dependendentOnTaskId,
        type: 1,
        value: dependence.dependentType,
      };
    });
  };

  const viewData: Options[] = [
    { label: "Day", value: "day" },
    { label: "Week", value: "week" },
    { label: "Month", value: "month" },
    { label: "Year", value: "year" },
  ];
  const taskColumns: GanttChartTaskColumn[] = [
    {
      label: "Tasks",
      value: "label",
      formatFunction: function (item: string, task: GanttChartTask) {
        if (task.value == "false") {
          return `<div class="rounded-full flex gap-2" id=${task.id}>
              <img src=${addIcon} /> <div>Task</div>
            </div>`;
        } else {
          return ReactDOMServer.renderToString(
            <TitleHover title={item} taskId={task.id} />
          );
        }
      },
    },
    {
      label: "Assignee",
      value: "resources",
      formatFunction: function (item: string, data: GanttChartTask) {
        let html = "";
        if (item && item.length && data.value !== "false") {
          const resources: UserOrganisationType[] = JSON.parse(item);
          html = ReactDOMServer.renderToString(
            <div className="w-full my-3" key={"resources1"}>
              <div
                className="w-24 grid grid-cols-[repeat(auto-fit,minmax(10px,max-content))] mr-2"
                key={"resources1"}
              >
                {resources.slice(0, 3).map((item, index) => {
                  const zIndex = Math.abs(index - 2);
                  return (
                    <>
                      <div key={index} style={{ zIndex: zIndex }}>
                        <UserAvatar
                          className={`shadow-sm p-0 h-6 w-6`}
                          fontClass={"text-xs"}
                          user={item.user}
                        ></UserAvatar>
                      </div>
                    </>
                  );
                })}
                {resources && resources?.length > 3 && (
                  <div className="bg-gray-200/30 w-8  text-lg font-medium h-8 rounded-full flex justify-center items-center">
                    {`${resources.length - 3}+`}
                  </div>
                )}
              </div>
            </div>
          );
          return `<div class="flex gap-1 items-center rounded-md"> ${html} </div>`;
        } else {
          return "";
        }
      },
    },
    {
      label: "Progress",
      value: "progress",
      formatFunction: function (item: string, task: GanttChartTask) {
        if (task.value !== "false") {
          return ReactDOMServer.renderToString(
            <div className="my-auto">
              <Progress value={Number(item)} />
            </div>
          );
        } else {
          return "";
        }
      },
    },
  ];

  const handleView = (val: SingleValue<Options>) => {
    if (val) {
      setFilterUnit(val.value);
    }
  };

  const updateTaskFromGanttView = (e: (Event & CustomEvent) | undefined) => {
    const duration = calculateDuration(e?.detail.dateStart, e?.detail.dateEnd);

    taskUpdateMutation.mutate(
      {
        id: e?.detail.id,
        startDate: new Date(e?.detail.dateStart),
        duration: duration,
      },
      {
        onSuccess(data) {
          toast.success(data.data.message);
          allTaskQuery.refetch();
        },
        onError(error) {
          toast.error(error.response?.data.message);
        },
      }
    );
  };
  const HandleNonWorkingDays = () => {
    const nonWorkingDays =
      user?.userOrganisation.map((org) => org.organisation.nonWorkingDays) ||
      [];

    const mapDayToNumber = (day: string) => {
      switch (day) {
        case "SUN":
          return 0;
        case "MON":
          return 1;
        case "TUE":
          return 2;
        case "WED":
          return 3;
        case "THU":
          return 4;
        case "FRI":
          return 5;
        case "SAT":
          return 6;
        default:
          return 0;
      }
    };

    const result: number[] = [];
    nonWorkingDays.forEach((days) => {
      days.forEach((day) => {
        result.push(mapDayToNumber(day));
      });
    });
    return result;
  };
  function calculateDuration(startDate: Date, endDate: Date) {
    console.log({ startDate }, { endDate });

    let duration = 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    // start.setHours(0);
    // start.setMinutes(0);
    // start.setSeconds(0);
    // start.setMilliseconds(0);
    // end.setHours(0);
    // end.setMinutes(0);
    // end.setSeconds(0);
    // end.setMilliseconds(0);

    // Define a function to check if a given date is a non-working day
    const isNonWorkingDay = (date: Date) => {
      const dayOfWeek = date.getDay(); // Sunday: 0, Monday: 1, ..., Saturday: 6
      return HandleNonWorkingDays().includes(dayOfWeek);
    };

    // Define a function to check if a given date is a holiday
    const isHoliday = (date: Date) => {
      const dateString = date.toISOString().split("T")[0];
      return user?.userOrganisation[0].organisation.orgHolidays.some(
        (holiday) => holiday.holidayStartDate.split("T")[0] === dateString
      );
    };

    while (start <= end) {
      // Check if the current day is a non-working day or holiday
      if (!isNonWorkingDay(start) && !isHoliday(start)) {
        duration++;
      }
      start.setDate(start.getDate() + 1);
    }

    return duration;
  }

  // Test the function

  const taskSetter = (
    task: any,
    segment: any,
    taskElement: Element,
    segmentElement: Element,
    labelElement: Element
  ) => {
    if (task.value == "false" && segment.value == "false") {
      taskElement.classList.add("hidden");
      segmentElement.classList.add("hidden");
      labelElement.classList.add("hidden");
    }
  };
  const [task, setTask] = useState<Task>();
  const [endTask, setEndTask] = useState();
  const onConnection = (e: (Event & CustomEvent) | undefined) => {
    setTask(
      allTaskQuery.data?.data.data.find(
        (t) => t.taskId === e?.detail.startTaskId
      )
    );
    setEndTask(e?.detail.endTaskId);
  };
  const removeTaskMutation = useRemoveTaskMutation();

  const removeTask = (id: string) => {
    removeTaskMutation.mutate(id, {
      onSuccess(data) {
        toast.success(data.data.message);
        setTaskRemove("");
        allTaskQuery.refetch();
      },
      onError(error) {
        toast.success(error.message);
        setTaskRemove("");
      },
    });
  };
  const TitleHover = (props: {
    title: string;
    taskId: string | undefined | null;
  }) => {
    return (
      <>
        <div className="group flex w-fit" title={props.taskId ?? ""}>
          {props.title}
          <div className="opacity-0 !flex !gap-1 transition ease-in-out delay-150  group-hover:opacity-100 group-hover:block z-50 bg-gra rounded-lg">
            <Button
              id={BUTTON_EVENT.REMOVE}
              value={"remove"}
              variant={"none"}
              size={"sm"}
              className="p-0 !h-full"
            >
              <img
                src={TrashCan}
                id={BUTTON_EVENT.REMOVE}
                alt={props.taskId ?? ""}
              />
            </Button>
            <Button
              id={BUTTON_EVENT.EDIT}
              variant={"none"}
              size={"sm"}
              className="p-0 !h-full"
            >
              <img
                src={Edit}
                id={BUTTON_EVENT.EDIT}
                alt={props.taskId ?? ""}
              />
            </Button>
          </div>
        </div>
      </>
    );
  };
  const handleItemClick = async (event: (Event & CustomEvent) | undefined) => {
    event?.preventDefault();
    const eventDetails = event?.detail;
    const target = eventDetails.originalEvent.target;
    if (eventDetails.item.value == "false") {
      setTaskId(eventDetails.item.id);
      setIsTaskOpen(true);
    }
    if (target.id === BUTTON_EVENT.REMOVE) {
      setTaskRemove(target.alt);
    }
    if (target.id === BUTTON_EVENT.EDIT) {
      setTaskEdit(target.alt);
    }
  };
  const [monthScale, setMonthScale] = useState("week");
  useEffect(() => {
    if (filterUnit === "month") {
      setMonthScale("week");
    } else {
      setMonthScale("day");
    }
  }, [filterUnit]);
  return (
    <div className="h-full w-full flex flex-col pb-5">
      <div className="flex justify-between">
        <div className="flex justify-center items-center gap-2 my-2 ">
          <TaskFilter
            tasks={allTaskQuery.data?.data.data}
            ref={filterRef}
            fieldToShow={[
              FIELDS.ASSIGNED,
              FIELDS.DATE,
              FIELDS.DUESEVENDAYS,
              FIELDS.FLAGS,
              FIELDS.OVERDUEDAYS,
              FIELDS.TODAYDUEDAYS,
              FIELDS.TASK,
            ]}
            filteredData={(data) => setFilterData(data)}
          />
        </div>
        <div className="flex justify-end items-center gap-2 my-2 ">
          <label className="flex justify-center items-center">Filter by:</label>
          <Select
            options={viewData}
            onChange={handleView}
            placeholder="Select Filter"
            styles={reactSelectStyle}
            defaultValue={{ label: "month", value: "month" }}
          />
        </div>
      </div>
      <GanttChart
        ref={ganttChart}
        dataSource={taskData}
        taskColumns={taskColumns}
        treeSize={treeSize}
        durationUnit={durationUnit}
        nonworkingDays={HandleNonWorkingDays()}
        monthScale={monthScale}
        monthFormat="long"
        dayFormat="long"
        weekFormat="long"
        disableSelection
        view={filterUnit}
        sortMode={sortMode}
        tooltip={tooltip}
        onOpening={(e) => {
          e?.preventDefault();
        }}
        onResizeEnd={(e) => {
          updateTaskFromGanttView(e as (Event & CustomEvent) | undefined);
        }}
        onConnectionEnd={(e) =>
          onConnection(e as (Event & CustomEvent) | undefined)
        }
        onDragEnd={(e) => {
          updateTaskFromGanttView(e as (Event & CustomEvent) | undefined);
        }}
        className="h-full scroll"
        hideResourcePanel
        infiniteTimeline
        horizontalScrollBarVisibility="visible"
        verticalScrollBarVisibility="visible"
        showProgressLabel={showProgressLabel}
        snapToNearest
        onItemClick={(e) =>
          handleItemClick(e as (Event & CustomEvent) | undefined)
        }
        onTaskRender={taskSetter}
      />
      <Dialog
        isOpen={Boolean(endTask && task)}
        onClose={() => {}}
        modalClass="rounded-lg w-4/5  h-1/3"
      >
        <div className="w-full p-6">
          <div className="flex justify-between">
            <div className="text-lg">{task?.taskName}</div>
            <Button variant={"none"} onClick={() => setEndTask(undefined)}>
              <img src={CrossSvg} />
            </Button>
          </div>
          {task && (
            <TaskDependencies
              endTask={endTask}
              task={task}
              refetch={() => {
                allTaskQuery.refetch(), setEndTask(undefined);
              }}
            />
          )}
        </div>
      </Dialog>
      <Dialog
        isOpen={Boolean(taskRemove)}
        onClose={() => {}}
        modalClass="rounded-lg"
      >
        <div className="flex flex-col gap-2 p-6 ">
          <img src={TrashCan} className="w-12 m-auto" /> Are you sure you want
          to delete ?
          <div className="flex gap-2 ml-auto">
            <Button variant={"outline"} onClick={() => setTaskRemove("")}>
              Cancel
            </Button>
            <Button
              variant={"primary"}
              isLoading={removeTaskMutation.isPending}
              disabled={removeTaskMutation.isPending}
              onClick={() => removeTask(taskRemove)}
            >
              Delete
            </Button>
          </div>
        </div>
      </Dialog>
      {Boolean(taskEdit) && (
        <TaskSubTaskForm
          taskId={taskEdit}
          projectId={projectId}
          close={() => {
            setTaskEdit(""), allTaskQuery.refetch();
          }}
        />
      )}
      {(Boolean(taskId) || isTaskOpen) && (
        <TaskSubTaskForm
          projectId={projectId}
          createSubtask={taskId}
          close={() => {
            setTaskId(""), setIsTaskOpen(false), allTaskQuery.refetch();
          }}
        />
      )}
    </div>
  );
}

export default GanttView;
