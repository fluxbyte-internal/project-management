import { useEffect, useRef, useState } from "react";
import GanttChart, {
  GanttChartProps,
} from "smart-webcomponents-react/ganttchart";
import { useParams } from "react-router-dom";
import Select, { SingleValue } from "react-select";
import useAllTaskQuery from "@/api/query/useAllTaskQuery";
import "../../SmartElement.css";
import useUpdateTaskMutation from "@/api/mutation/useTaskUpdateMutation";
import { toast } from "react-toastify";
import { useUser } from "@/hooks/useUser";
import TaskDependencies from "../tasks/taskDependencies";
import { Task } from "@/api/mutation/useTaskCreateMutation";
import Dialog from "../common/Dialog";
import CrossSvg from "@/assets/svg/CrossIcon.svg";
import { Button } from "../ui/button";
export interface Options {
  label: string;
  value: string;
}

function GanttView(
  props: GanttChartProps & { taskId: string | undefined; close: () => void }
) {
  const treeSize = "30%";
  const durationUnit = "hour";
  const sortMode = "one";
  const taskFiltering = true;
  // const horizontalScrollBarVisibility=true
  // const showBaseline = true;
  const showProgressLabel = true;

  const { projectId } = useParams();
  const [filterUnit, setFilterUnit] = useState<string>("week");
  const [filterUser, setFilterUser] = useState<string>();
  const ganttChart = useRef<GanttChart>(null);
  const { user } = useUser();
  console.log(filterUser, "filterUser");
  const allTaskQuery = useAllTaskQuery(projectId);
  const [viewUserData, setViewUserData] = useState<Options[]>([]);
  const taskUpdateMutation = useUpdateTaskMutation();
  useEffect(() => {
    const users: Options[] = [];
    if (allTaskQuery.data?.data.data) {
      allTaskQuery.data?.data.data.forEach((task) => {
        task.assignedUsers?.forEach((assignedUser) => {
          if (!users.some((u) => u.value === assignedUser.user.email)) {
            users.push({
              label:
                !assignedUser.user?.firstName && !assignedUser.user?.lastName
                  ? assignedUser.user.email
                  : assignedUser.user?.firstName +
                    " " +
                    assignedUser.user?.lastName,
              value: assignedUser.user.email,
            });
          }
        });
      });
      setViewUserData(users);
    }
    // refetch();
    ganttChart.current?.refresh();
  }, [allTaskQuery.data?.data.data]);

  const tooltip = {
    enabled: true,
  };

  const viewData: Options[] = [
    { label: "Day", value: "day" },
    { label: "Week", value: "week" },
    { label: "Month", value: "month" },
  ];

  const handleView = (val: SingleValue<Options>) => {
    if (val) {
      setFilterUnit(val.value);
    }
  };
  const handleUserAssignee = (val: SingleValue<Options>) => {
    if (val) {
      setFilterUser(val.value);
    }
  };
  const updateTaskFromGanttView = (e: (Event & CustomEvent) | undefined) => {
    const  duration  = calculateDuration(
      e?.detail.dateStart,
      e?.detail.dateEnd
    );
    taskUpdateMutation.mutate(
      {
        taskId: e?.detail.id,
        startDate: e?.detail.dateStart,
        duration: parseFloat(duration),
      },
      {
        onSuccess(data) {
          toast.success(data.data.message);
        },
        onError(error) {
          toast.error(error.response?.data.message);
        },
      }
    );
  };
  function calculateDuration(startDate:Date, endDate:Date) {
    // Convert the date strings to Date objects
    const start:number = new Date(startDate).getTime();
    const end:number = new Date(endDate).getTime();
    const durationMs = end - start;

    const durationDays = durationMs / (1000 * 60 * 60 * 24);

    return parseFloat(durationDays+'').toFixed(2);
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
  const taskrender = (
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
  return (
    <div className="h-full w-full flex flex-col py-5">
      <div className="flex justify-between">
        <div className="flex justify-center items-center gap-2 my-2 ">
          <label className="flex justify-center items-center">Filter by:</label>
          <Select
            options={viewUserData}
            onChange={handleUserAssignee}
            placeholder="Select Filter"
            styles={reactSelectStyle}
            className="min-w-[240px]"
          />
        </div>
        <div className="flex justify-end items-center gap-2 my-2 ">
          <label className="flex justify-center items-center">Filter by:</label>
          <Select
            options={viewData}
            onChange={handleView}
            placeholder="Select Filter"
            styles={reactSelectStyle}
            defaultValue={{ label: "Week", value: "week" }}
          />
        </div>
      </div>
      <GanttChart
        ref={ganttChart}
        dataSource={props.dataSource}
        taskColumns={props.taskColumns}
        treeSize={treeSize}
        durationUnit={durationUnit}
        nonworkingDays={HandleNonWorkingDays()}
        monthScale="day"
        monthFormat="short"
        dayFormat="short"
        weekFormat="long"
        hourFormat="2-digit"
        disableSelection
        view={filterUnit}
        sortMode={sortMode}
        taskFiltering={taskFiltering}
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
        className="h-full"
        hideResourcePanel
        infiniteTimeline
        horizontalScrollBarVisibility="visible"
        verticalScrollBarVisibility="visible"
        showProgressLabel={showProgressLabel}
        snapToNearest
        autoSchedule
        onItemClick={props.onItemClick}
        onTaskRender={taskrender}
      ></GanttChart>
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
    </div>
  );
}

export default GanttView;
