import { Task } from "@/api/mutation/useTaskCreateMutation";
import useAllTaskQuery from "@/api/query/useAllTaskQuery";
import PercentageCircle from "@/components/shared/PercentageCircle";
import Table, { ColumeDef } from "@/components/shared/Table";
import TaskSubTaskForm from "@/components/tasks/taskSubTaskForm";
import { Button } from "@/components/ui/button";
import dateFormater from "@/helperFuntions/dateFormater";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NoTask from "./NoTask";

function Tasks() {
  const [taskData, setTaskData] = useState<Task[]>();
  const [taskId, setTaskId] = useState<string | undefined>();
  const [taskCreate, setTaskCreate] = useState<boolean>(false);
  const { projectId } = useParams();
  const allTaskQuery = useAllTaskQuery(projectId);
  
  const close = () => {
    setTaskId(undefined);
    setTaskCreate(false);
    allTaskQuery.refetch();
  };
  const columnDef: ColumeDef[] = [
    { key: "taskName", header: "Task Name", sorting: true },
    {
      key: "startDate",
      header: "Start Date",
      sorting: true,
      onCellRender: (item: Task) => (
        <>{dateFormater(new Date(item.startDate))}</>
      ),
    },
    {
      key: "status",
      header: "Status",
      onCellRender: (item: Task) => (
        <>
          <div className="w-32 h-8 px-3 py-1.5 bg-cyan-100 rounded justify-center items-center gap-px inline-flex">
            <div className="text-cyan-700 text-xs font-medium leading-tight">
              {item.status}
            </div>
          </div>
        </>
      ),
    },
    {
      key: "startDate",
      header: "Start Date",
      sorting: true,
      onCellRender: (item: Task) => (
        <>{dateFormater(new Date(item.startDate))}</>
      ),
    },
    {
      key: "actualEndDate",
      header: "End Date",
      onCellRender: (item: Task) => (
        <>{item.endDate && dateFormater(new Date(item.endDate))}</>
      ),
    },
    {
      key: "progress",
      header: "Progress",
      onCellRender: (item: Task) => (
        <PercentageCircle percentage={item.completionPecentage} />
      ),
    },
    {
      key: "Action",
      header: "Action",
      onCellRender: (item: Task) => (
        <>
          <div
            onClick={() => setTaskId(item.taskId)}
            className="cursor-pointer w-24 h-8 px-3 py-1.5 bg-white border rounded justify-center items-center gap-px inline-flex"
          >
            View Tasks
          </div>
        </>
      ),
    },
  ];

  useEffect(() => {
    setTaskData(allTaskQuery.data?.data.data);
  }, [allTaskQuery.data?.data.data, projectId,taskId]);
  const createTask = () => {
    setTaskId("");
    setTaskCreate(true);
  };
  return (
    <div className="h-full">
      {taskData && taskData.length > 0 ? (
        <>
          <div className="py-5 px-16 w-full flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <h2 className="font-medium text-3xl leading-normal text-gray-600">
                Tasks
              </h2>
              <div>
                <Button variant={"primary"} onClick={createTask}>
                  Add Task
                </Button>
              </div>
            </div>
          </div>
          <div className="h-[80%]">
            <Table columnDef={columnDef} data={taskData}></Table>
          </div>
        </>
      ) : (
        (projectId &&taskData && taskData.length==0) && <NoTask projectId={projectId} refetch={()=>allTaskQuery.refetch()}/>
      )}
      {(Boolean(taskId) || taskCreate) && (
        <TaskSubTaskForm taskId={taskId} projectId={projectId} close={close} />
      )}
    </div>
  );
}

export default Tasks;
