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
import Dialog from "@/components/common/Dialog";
import useRemoveTaskMutation from "@/api/mutation/useTaskRemove";
import TrashCan from "../../assets/svg/TrashCan.svg";
import Edit from "../../assets/svg/EditPen.svg";
import { toast } from "react-toastify";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Settings } from "lucide-react";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import DimondIcon from "../../assets/svg/DiamondIcon.svg";
function Tasks() {
  const [taskData, setTaskData] = useState<Task[]>();
  const [taskId, setTaskId] = useState<string | undefined>();
  const [taskCreate, setTaskCreate] = useState<boolean>(false);
  const { projectId } = useParams();
  const allTaskQuery = useAllTaskQuery(projectId);
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(
    null
  );
  const close = () => {
    setTaskId(undefined);
    setTaskCreate(false);
    allTaskQuery.refetch();
  };

  const columnDef: ColumeDef[] = [
    {
      key: "taskName",
      header: "Task Name",
      sorting: true,
      onCellRender: (item: Task) => (
        <div className="flex gap-2 items-center">
          <div>{item.taskName}</div>
          {item.milestoneIndicator && (
            <div className="img w-3.5 h-3.5">
              <img src={DimondIcon} />
            </div>
          )}
        </div>
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
        <PercentageCircle percentage={item.completionPecentage ?? 0} />
      ),
    },
    {
      key: "Action",
      header: "Action",
      onCellRender: (item: Task) => (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="cursor-pointer w-24 h-8 px-3 py-1.5 bg-white border rounded justify-center items-center gap-px inline-flex">
                <Settings className="mr-2 h-4 w-4" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-fit flex flex-col gap-1 bg-white shadow rounded">
              <DropdownMenuItem onClick={() => setTaskId(item.taskId)}>
                <img src={Edit} className="mr-2 h-4 w-4 " alt="" />
                <span className="p-0 font-normal h-auto">View Tasks</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="mx-1" />
              <DropdownMenuItem
                onClick={() => setShowConfirmDelete(item.taskId)}
              >
                <img src={TrashCan} className="mr-2 h-4 w-4 text-[#44546F]" />
                <span className="p-0 font-normal h-auto text-red-500">
                  Remove
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ),
    },
  ];

  const accordionColumnDef: ColumeDef[] = [
    {
      key: "taskName",
      header: "Task Name",
      sorting: true,
      onCellRender: (item: Task) => (
        <div className="flex gap-2 items-center">
          <div>{item.taskName}</div>
          {item.milestoneIndicator && (
            <div className="img w-3.5 h-3.5">
              <img src={DimondIcon} />
            </div>
          )}
        </div>
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
        <PercentageCircle percentage={item.completionPecentage ?? 0} />
      ),
    },
    {
      key: "Action",
      header: "Action",
      onCellRender: (item: Task) => (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="cursor-pointer w-24 h-8 px-3 py-1.5 bg-white border rounded justify-center items-center gap-px inline-flex">
                <Settings className="mr-2 h-4 w-4" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-fit flex flex-col gap-1 bg-white shadow rounded">
              <DropdownMenuItem onClick={() => setTaskId(item.taskId)}>
                <img src={Edit} className="mr-2 h-4 w-4 " alt="" />
                <span className="p-0 font-normal h-auto">View Tasks</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="mx-1" />
              <DropdownMenuItem
                onClick={() => setShowConfirmDelete(item.taskId)}
              >
                <img src={TrashCan} className="mr-2 h-4 w-4 text-[#44546F]" />
                <span className="p-0 font-normal h-auto text-red-500">
                  Remove
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ),
    },
  ];

  useEffect(() => {
    if (allTaskQuery.data?.data.data) {
      allTaskQuery.data?.data.data.forEach((task) => {
        task.subtasks = allTaskQuery.data?.data.data.filter(
          (subtask) => subtask.parentTaskId === task.taskId
        );
      });
      const topLevelTasks = allTaskQuery.data?.data.data.filter(
        (task) => task.parentTaskId === null
      );
      const convertedData = topLevelTasks.map((task) => convertTask(task));
      setTaskData(convertedData);
    }
  }, [allTaskQuery.data?.data.data, taskId]);

  const convertTask = (originalTask: Task) => {
    const convertedTask:Task&{tasks?:Task[]} = originalTask;
    if (originalTask.subtasks) {
      convertedTask.tasks = originalTask.subtasks.map((subtask) =>
        convertTask(subtask)
      );
    }

    return convertedTask;
  };
  const createTask = () => {
    setTaskId("");
    setTaskCreate(true);
  };
  const removeTaskMutation = useRemoveTaskMutation();
  const removeTask = () => {
    if (showConfirmDelete) {
      removeTaskMutation.mutate(showConfirmDelete, {
        onSuccess(data) {
          setShowConfirmDelete(null);
          allTaskQuery.refetch();
          toast.success(data.data.message);
        },
        onError(error) {
          toast.error(error.response?.data.message);
        },
      });
    }
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
            <Table columnDef={columnDef} data={taskData} accordion={true} accordionColumnDef={accordionColumnDef} accordionDataKey="tasks"></Table>
          </div>
        </>
      ) : (
        projectId &&
        taskData &&
        taskData.length == 0 && (
          <NoTask
            projectId={projectId}
            refetch={() => allTaskQuery.refetch()}
          />
        )
      )}
      {(Boolean(taskId) || taskCreate) && (
        <TaskSubTaskForm taskId={taskId} projectId={projectId} close={close} />
      )}
      <Dialog
        isOpen={Boolean(showConfirmDelete)}
        onClose={() => {}}
        modalClass="rounded-lg"
      >
        <div className="flex flex-col gap-2 p-6 ">
          <img src={TrashCan} className="w-12 m-auto" /> Are you sure you want
          to delete ?
          <div className="flex gap-2 ml-auto">
            <Button
              variant={"outline"}
              isLoading={removeTaskMutation.isPending}
              disabled={removeTaskMutation.isPending}
              onClick={() => setShowConfirmDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant={"primary"}
              onClick={removeTask}
              isLoading={removeTaskMutation.isPending}
              disabled={removeTaskMutation.isPending}
            >
              Delete
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default Tasks;
