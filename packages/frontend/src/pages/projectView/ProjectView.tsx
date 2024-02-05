import Loader from "@/components/common/Loader";
import SideBar from "@/components/layout/SideBar";
import GanttView from "@/components/view/GanttView";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAllTaskQuery from "@/api/query/useAllTaskQuery";
import { Task } from "@/api/mutation/useTaskCreateMutation";
import UserAvatar from "@/components/ui/userAvatar";
import { UserOrganisationType } from "@/api/query/useOrganisationDetailsQuery";
import ReactDOMServer from "react-dom/server";
import {
  GanttChartTask,
  GanttChartTaskColumn,
} from "smart-webcomponents-react/ganttchart";
import PercentageCircle from "@/components/shared/PercentageCircle";
import addIcon from "@/assets/svg/AddProjectIcon.svg";
import TaskSubTaskForm from "@/components/tasks/taskSubTaskForm";
import TrashCan from "@/assets/svg/TrashCan.svg";
import Edit from "@/assets/svg/EditPen.svg";
import { Button } from "@/components/ui/button";
import Dialog from "@/components/common/Dialog";
import useRemoveTaskMutation from "@/api/mutation/useTaskRemove";
import { toast } from "react-toastify";

enum BUTTON_EVENT {
  EDIT = "EDIT",
  REMOVE = "REMOVE",
}

function ProjectView() {
  const [taskRemove, setTaskRemove] = useState("");
  const [taskEdit, setTaskEdit] = useState("");

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
            <PercentageCircle percentage={item} />
          );
        } else {
          return "";
        }
      },
    },
  ];
  const [isSidebarExpanded, setSidebarExpanded] = useState(true);
  const [taskData, setTaskData] = useState<GanttChartTask[]>();

  const toggleSidebar = () => {
    setSidebarExpanded(!isSidebarExpanded);
  };

  const { projectId } = useParams();
  const allTaskQuery = useAllTaskQuery(projectId);
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
        ? originalTask.completionPecentage
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
  const [taskId, setTaskId] = useState<string>();
  const [isTaskOpen, setIsTaskOpen] = useState<boolean>(false);
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
      convertedData.push({
        id: "",
        value: "false",
        label: "add task",
        dateStart: new Date(),
        dateEnd: new Date(),
      });
      setTaskData(convertedData);
    }
  }, [allTaskQuery.data?.data.data, projectId]);

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

  const TitleHover = (props: {
    title: string;
    taskId: string | undefined | null;
  }) => {
    return (
      <>
        <div className="group" title={props.taskId ?? ""}>
          {props.title}
          <div className="!mt-2 opacity-0 !flex !gap-1 transition ease-in-out delay-150 absolute group-hover:opacity-100 group-hover:block z-50 bg-gra rounded-lg">
            <Button
              id={BUTTON_EVENT.REMOVE}
              value={"remove"}
              variant={"none"}
              size={"sm"}
              className="p-0 h-0"
            >
              <img
                src={TrashCan}
                id={BUTTON_EVENT.REMOVE}
                alt={props.taskId ?? ""}
                className="h-4 w-4 mt-1"
              />
            </Button>
            <Button
              id={BUTTON_EVENT.EDIT}
              variant={"none"}
              size={"sm"}
              className="p-0 h-0"
            >
              <img
                src={Edit}
                id={BUTTON_EVENT.EDIT}
                className="h-3 w-3 mt-1"
                alt={props.taskId ?? ""}
              />
            </Button>
          </div>
        </div>
      </>
    );
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
  return (
    <div className="w-full relative h-full overflow-hidden">
      {allTaskQuery.isLoading ? (
        <Loader />
      ) : (
        <>
          <SideBar
            toggleSidebar={toggleSidebar}
            isSidebarExpanded={isSidebarExpanded}
          />
          <div
            className={`px-2 h-full ${isSidebarExpanded ? "ml-64" : "ml-4"}`}
          >
            <GanttView
              dataSource={taskData}
              taskColumns={taskColumns}
              shadeUntilCurrentTime={true}
              currentTimeIndicator={true}
              className="h-full w-full"
              autoSchedule
              onItemClick={(e) =>
                handleItemClick(e as (Event & CustomEvent) | undefined)
              }
              close={() => {
                setTaskId(""), allTaskQuery.refetch();
              }}
              taskId={taskId}
            />
          </div>
          {(Boolean(taskId) || isTaskOpen) && (
            <TaskSubTaskForm
              projectId={projectId}
              createSubtask={taskId}
              close={() => {
                setTaskId(""), setIsTaskOpen(false), allTaskQuery.refetch();
              }}
            />
          )}
        </>
      )}
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
    </div>
  );
}

export default ProjectView;
