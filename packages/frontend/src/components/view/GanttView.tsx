import { useEffect, useRef, useState } from "react";
import GanttChart, {
  GanttChartProps,
} from "smart-webcomponents-react/ganttchart";
import TaskSubTaskForm from "../tasks/taskSubTaskForm";
import { useParams } from "react-router-dom";
import Select, { SingleValue } from "react-select";
import useAllTaskQuery from "@/api/query/useAllTaskQuery";
import "../../SmartElement.css";

export interface Options {
  label: string;
  value: string;
}

function GanttView(props: GanttChartProps) {
  const treeSize = "30%";
  const durationUnit = "hour";
  const sortMode = "one";
  const taskFiltering = true;
  // const showBaseline = true;

  const { projectId } = useParams();
  const [isOpenTask, setIsOpenTask] = useState<string>();
  const [filterUnit, setFilterUnit] = useState<string>("week");
  const [filterUser, setFilterUser] = useState<string>();
  const ganttChart = useRef<GanttChart>(null);

  console.log(filterUser, "filterUser");
  const allTaskQuery = useAllTaskQuery(projectId);
  const [viewUserData, setViewUserData] = useState<Options[]>([]);

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
  }, [allTaskQuery.data]);

  const handlePopUp = (e: any) => {
    e?.stopPropagation();
    setIsOpenTask(e.detail.id);
    console.log(e.detail.id, "e.Detail.values");
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
        monthScale="day"
        monthFormat="firstTwoLetters"
        id="gantt"
        onItemClick={(e) => handlePopUp(e)}
        view={filterUnit}
        sortMode={sortMode}
        taskFiltering={taskFiltering}
        hideResourcePanel
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