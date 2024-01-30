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
function ProjectView() {
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
          return `<div class="flex gap-1 items-center font-semibold text-base rounded-md"> ${item} </div>`;
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
                          className={`shadow-sm `}
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
    {
      label: "Action",
      value: "id",
      formatFunction: function (item: string, task: GanttChartTask) {
        if (task.value !== "false") {
          return item;
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
        value:dependence.dependentType
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
    // const gantt = ganttChart.current;
    event?.preventDefault();
    const eventDetails = event?.detail;
    // const target = eventDetails.originalEvent.target;

    if (eventDetails.item.value == "false") {
      setTaskId(eventDetails.item.id);
      setIsTaskOpen(true);
    }
    if (eventDetails.item.value !== "false") {
      // setIsOpenTask(eventDetails.item.id);
    }
    // if (target.classList.contains("add-task-button")) {
    //   const itemPath = await gantt.getItemPath(eventDetails.item);
    //   const itemIndex = parseInt(itemPath.split(".").slice(-1)[0]) + 1;

    //   const taskProject = await gantt.getTaskProject(eventDetails.item);
    //   const itemProject = await gantt.getItemPath(taskProject);

    //   //Add a new Task
    //   const newItemId = await gantt.insertTask(
    //     {
    //       label: "New Task",
    //       dateStart: gantt.dateStart,
    //     },
    //     itemProject,
    //     itemIndex
    //   );

    //   //Open the Editor to configure
    //   gantt.openWindow(newItemId);
    // }
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
    </div>
  );
}

export default ProjectView;
