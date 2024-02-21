import { Task } from "@/api/mutation/useTaskCreateMutation";
import useAllTaskQuery from "@/api/query/useAllTaskQuery";
import PercentageCircle from "@/components/shared/PercentageCircle";
import Table, { ColumeDef } from "@/components/shared/Table";
import TaskSubTaskForm from "@/components/tasks/taskSubTaskForm";
import { Button } from "@/components/ui/button";
import dateFormater from "@/helperFuntions/dateFormater";
import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
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
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Settings } from "lucide-react";
import DimondIcon from "../../assets/svg/DiamondIcon.svg";
import DownArrowIcon from "../../assets/svg/DownArrow.svg";
import UserAvatar from "@/components/ui/userAvatar";
import TaskFilter, { TaskFilterRef } from "@/components/views/TaskFilter";
import { FIELDS } from "@/api/types/enums";
function Tasks() {
  const [taskData, setTaskData] = useState<Task[]>();
  const [filterData, setFilterData] = useState<Task[] | undefined>(taskData);
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
  };
  // useEffect(() => {
  //   allTaskQuery.refetch();
  // }, [third])

  const columnDef: ColumeDef[] = [
    {
      key: "dropdown",
      header: " ",
      onCellRender: (item: Task) => (
        <div>
          {item.subtasks.length > 0 && (
            <div className="img w-3.5 h-3.5">
              <img src={DownArrowIcon} />
            </div>
          )}
        </div>
      ),
    },
    {
      key: "flag",
      header: "Flag",
      sorting: true,
      onCellRender: (item: Task) => (
        <div
          className={`h-4 w-4 rounded-full ${
            item?.flag == "Green"
              ? "bg-green-500/60 border border-green-500"
              : item?.flag == "Red"
              ? "bg-red-500/60 border border-red-500/60"
              : item?.flag == "Orange"
              ? "bg-primary-500/60 border border-primary-500/60"
              : ""
          }`}
        ></div>
      ),
    },
    {
      key: "taskName",
      header: "Task Name",
      sorting: true,
      onCellRender: (item: Task) => (
        <div
          className={`flex gap-2 items-center ${
            item.subtasks.length > 0 ? "cursor-pointer" : "cursor-not-allowed"
          }`}
        >
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
      key: "status",
      header: "Status",
      onCellRender: (item: Task) => (
        <>
          <div className="w-32 h-8 px-3 py-1.5 bg-cyan-100 rounded justify-center items-center gap-px inline-flex">
            <div className="text-cyan-700 text-xs font-medium leading-tight">
              {item.status
                .toLowerCase()
                .replace(/_/g, " ")
                .replace(/\b\w/g, (char) => char.toUpperCase())}
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
        <>{dateFormater(new Date(item.dueDate ?? item.endDate))}</>
      ),
    },
    {
      key: "duration",
      header: "Duration",
      onCellRender: (item: Task) => <>{item.duration ?? 0}</>,
    },
    {
      key: "assigned",
      header: "Assigned to",
      onCellRender: (item: Task) => (
        <div className="w-full my-3">
          <div className="w-24 grid grid-cols-[repeat(auto-fit,minmax(10px,max-content))] mr-2">
            {item.assignedUsers.slice(0, 3).map((item, index) => {
              const zIndex = Math.abs(index - 2);
              return (
                <>
                  <div key={index} style={{ zIndex: zIndex }}>
                    <UserAvatar
                      className={`shadow-sm h-7 w-7`}
                      user={item.user}
                    ></UserAvatar>
                  </div>
                </>
              );
            })}
            {item.assignedUsers && item.assignedUsers?.length > 3 && (
              <div className="bg-gray-200/30 w-8  text-lg font-medium h-8 rounded-full flex justify-center items-center">
                {`${item.assignedUsers.length - 3}+`}
              </div>
            )}
            {item.assignedUsers.length <= 0 ? "N/A" : ""}
          </div>
        </div>
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
  const filterRef = useRef<TaskFilterRef | null>(null);
  useEffect(() => {
    if (allTaskQuery.data?.data.data) {
      setTaskData(setData(allTaskQuery.data?.data.data));
      setFilterData(
        setData(allTaskQuery.data?.data.data)?.sort(
          (a, b) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        )
      );
    }
    filterRef.current?.callFilter();
  }, [allTaskQuery.data?.data.data]);

  useEffect(() => {
    if (searchParams.get("milestones")) {
      setFilterData(taskData?.filter((d) => d.milestoneIndicator));
    }
    if (searchParams.get("status")) {
      setFilterData(
        findParentTasksWithDoneStatus(
          taskData ?? [],
          searchParams.get("status") ?? ""
        )
      );
    }
  }, [taskData]);

  useEffect(() => {
    allTaskQuery.refetch();
  }, [projectId, taskId]);

  const [searchParams] = useSearchParams();

  const setData = (data: Task[] | undefined) => {
    if (data) {
      data.forEach((task) => {
        task.subtasks =
          allTaskQuery.data?.data.data.filter(
            (subtask) => subtask.parentTaskId === task.taskId
          ) ?? [];
      });
      const topLevelTasks = data.filter((task) => task.parentTaskId === null);
      if (topLevelTasks.length==0 && data.length > 0) {
        return data.map((task) => convertTask(task));
      }
      else{
        return topLevelTasks.map((task) => convertTask(task));
      }
    }
  };

  const convertTask = (originalTask: Task) => {
    const convertedTask: Task & { tasks?: Task[] } = originalTask;
    if (originalTask.subtasks) {
      convertedTask.tasks = originalTask.subtasks.map((subtask) =>
        convertTask(subtask)
      );
    }

    return convertedTask;
  };

  const checkTaskStatus = (task: Task, status: string) => {
    if (task.subtasks && task.subtasks.length > 0) {
      const index = task.subtasks.findIndex((subtask) => {
        return checkTaskStatus(subtask, status);
      });
      return index !== -1;
    }
    return task.status === status;
  };

  function findParentTasksWithDoneStatus(tasks: Task[], status: string) {
    return tasks.filter((task) => {
      return checkTaskStatus(task, status);
    });
  }

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

  const subTableRender = (task: Task) => {
    return (
      <div className="shadow-md w-[99%]">
        {task.subtasks.length > 0 && (
          <Table
            data={task.subtasks}
            columnDef={columnDef}
            onAccordionRender={(task) =>
              task.subtasks.length > 0 ? subTableRender(task) : <></>
            }
            className="!py-1 border-0"
            hidePagination={true}
            hideHeaders={true}
          />
        )}
      </div>
    );
  };

  return (
    <div className="h-full overflow-hidden">
      {taskData && taskData.length > 0 ? (
        <>
          <div className="w-full flex flex-col gap-3 h-5/6">
            <div className="flex justify-between">
              <TaskFilter
                fieldToShow={[
                  FIELDS.ASSIGNED,
                  FIELDS.DATE,
                  FIELDS.DUESEVENDAYS,
                  FIELDS.FLAGS,
                  FIELDS.OVERDUEDAYS,
                  FIELDS.TODAYDUEDAYS,
                ]}
                view="LIST"
                ref={filterRef}
                filteredData={(data) => setFilterData(setData(data))}
                tasks={allTaskQuery.data?.data.data}
              />
              <div>
                <Button variant={"primary"} size={"sm"} onClick={createTask}>
                  Add Task
                </Button>
              </div>
            </div>
            <div className="!h-full">
              <Table
                columnDef={columnDef}
                data={filterData ?? []}
                onAccordionRender={(task) => subTableRender(task)}
                className="!pt-9 !pb-0 !sm:pb-7"
              ></Table>
            </div>
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
