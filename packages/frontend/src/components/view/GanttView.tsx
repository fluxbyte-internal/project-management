import { useEffect, useRef, useState } from "react";
import GanttChart, {
  GanttChartProps,
} from "smart-webcomponents-react/ganttchart";
import TaskSubTaskForm from "../tasks/taskSubTaskForm";
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
  const [isOpenTask, setIsOpenTask] = useState<string>();
  const [filterUnit, setFilterUnit] = useState<string>("week");
  const [filterUser, setFilterUser] = useState<string>();
  const [UpdateUser, setUpdateUser] = useState<string>();
  const ganttChart = useRef<GanttChart>(null);
  const { user } = useUser();
  console.log(filterUser, "filterUser");
  const allTaskQuery = useAllTaskQuery(projectId);
  const [viewUserData, setViewUserData] = useState<Options[]>([]);
  const taskUpdateMutation = useUpdateTaskMutation(UpdateUser);
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

  const handlePopUp = (e: (Event & CustomEvent) | undefined) => {
    
    e?.preventDefault();
    if (
      e?.detail.target &&
      e?.detail.target._target &&
      e?.detail.target._target.id
    ) {
      setIsOpenTask(e?.detail.target._target.id);
    }
  };

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
  const updateTaskFromGanttView = (e: {
    detail: { dateStart: Date; dateEnd: Date };
  }) => {
    const workingDays = dateDifference(e.detail.dateStart, e.detail.dateEnd);

    taskUpdateMutation.mutate(
      {
        startDate: e.detail.dateStart,
        duration: workingDays,
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
  const dateDifference = (startDate: Date, endDate: Date) => {
    const date1: any = new Date(startDate);
    const date2: any = new Date(endDate);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const nonWorkingDays = HandleNonWorkingDays();

    let nonWorkingDaysCount = 0;
    for (let i = 0; i < diffDays; i++) {
      const currentDate = new Date(date1);
      currentDate.setDate(date1.getDate() + i);

      if (nonWorkingDays.find((day: number) => day === currentDate.getDay())) {
        nonWorkingDaysCount++;
      }
    }

    const workingDays = diffDays - nonWorkingDaysCount;

    return workingDays;
  };

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
        monthScale="week"
        monthFormat="2-digit"
        onOpen={(e) => {
          handlePopUp(e as (Event & CustomEvent) | undefined);
        }}
        disableSelection
        view={filterUnit}
        sortMode={sortMode}
        taskFiltering={taskFiltering}
        tooltip={tooltip}
        onResizeEnd={(e: any) => {
          setUpdateUser(e?.detail.id), updateTaskFromGanttView(e);
        }}
        onConnectionEnd={(e) =>
          onConnection(e as (Event & CustomEvent) | undefined)
        }
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
      {Boolean(isOpenTask) && (
        <TaskSubTaskForm
          projectId={projectId}
          taskId={isOpenTask}
          close={() => {
            setIsOpenTask(""), close();
          }}
        />
      )}
      <Dialog
        isOpen={Boolean(endTask && task)}
        onClose={() => {}}
        modalClass="rounded-lg w-4/5  h-1/3"
      >
        <div className="w-full p-6">
          <div className="flex justify-between">
            <div className="text-lg">
              {task?.taskName}
            </div>
            <Button variant={"none"} onClick={()=>setEndTask(undefined)}>
              <img src={CrossSvg} />
            </Button>
          </div>
          {task && (
            <TaskDependencies
              endTask={endTask}
              task={task}
              refetch={() => {allTaskQuery.refetch(),setEndTask(undefined)}}
            />
          )}
        </div>
      </Dialog>
    </div>
  );
}

export default GanttView;
