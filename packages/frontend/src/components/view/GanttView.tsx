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

export interface Options {
  label: string;
  value: string;
}

function GanttView(props: GanttChartProps) {
  const treeSize = "30%";
  const durationUnit = "hour";
  const sortMode = "one";
  const taskFiltering = true;
  // const horizontalScrollBarVisibility=true
  // const showBaseline = true;

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
      allTaskQuery.data.data.data.forEach((task) => {
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
  }, [allTaskQuery.data]);

  const handlePopUp = (e: any) => {
    e.preventDefault();
    console.log(e.detail.target._target.id, "e.Detail.values");
    setIsOpenTask(e.detail.target._target.id);
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
  const updateTaskFromGanttView = (e: { detail: { dateStart: Date; dateEnd: Date; }; }) => {
  
    const workingDays = dateDiffrence(e.detail.dateStart, e.detail.dateEnd);
  
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
  const dateDiffrence = (startDate: Date, endDate: Date) => {
    const date1:any = new Date(startDate);
    const date2:any = new Date(endDate);
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

    const result: any = [];

    nonWorkingDays.forEach((days) => {
      days.forEach((day) => {
        result.push(mapDayToNumber(day));
      });
    });

    return result;
  };

  
  return (
    <div className="h-full w-full">
      <div className="flex justify-between">
        <div className="flex justify-center items-center gap-2 my-2 ">
          <label className="flex justify-center itmes-center">Filter by:</label>
          <Select
            options={viewUserData}
            onChange={handleUserAssignee}
            placeholder="Select Filter"
            styles={reactSelectStyle}
            className="min-w-[240px]"
          />
        </div>
        <div className="flex justify-end items-center gap-2 my-2 ">
          <label className="flex justify-center itmes-center">Filter by:</label>
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
        monthFormat="firstTwoLetters"
        id="gantt"
        onOpen={(e) => handlePopUp(e)}
        view={filterUnit}
        sortMode={sortMode}
        taskFiltering={taskFiltering}
        onResizeEnd={(e: any) => {
          setUpdateUser(e?.detail.id), updateTaskFromGanttView(e);
        }}
        hideResourcePanel
        infiniteTimeline
        horizontalScrollBarVisibility="visible"
        verticalScrollBarVisibility="visible"
        // for past day clr
        // shadeUntilCurrentTime
        // snap to nearest value
        snapToNearest 
        // showBaseline={showBaseline}
        autoSchedule
      ></GanttChart>
      {Boolean(isOpenTask) && (
        <TaskSubTaskForm
          projectId={projectId}
          taskId={isOpenTask}
          close={() => setIsOpenTask("")}
        />
      )}
    </div>
  );
}

export default GanttView;