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
import { GanttChartTask, GanttChartTaskColumn } from "smart-webcomponents-react/ganttchart";


function ProjectView() {
  const taskColumns: GanttChartTaskColumn[] = [
    {
      label: "Tasks",
      value: "label",
    },
    {
      label: "Assignee",
      value: "resources",
      formatFunction: function (item: string) {
        
        let html = "";

        const resources: UserOrganisationType[] = JSON.parse(item);
        resources.forEach(
          (user) =>
            (html += ReactDOMServer.renderToString(
              <div>
                {" "}
                <UserAvatar user={user.user} />{" "}
              </div>
            ))
        );

        return `<div class="flex gap-1 items-center rounded-md"> ${html} </div>`;
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
      dragProject:true
    };

    if (originalTask.subtasks) {
      convertedTask.tasks = originalTask.subtasks.map((subtask) =>
        convertTask(subtask)
      );
    }

    return convertedTask;
  };

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
  }, [allTaskQuery.data?.data.data, projectId]);

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
          <div className={`mt-14  ${isSidebarExpanded ? "ml-64" : "ml-4"}`}>
            <div className="sm:px-10 px-3">
              <GanttView
                dataSource={taskData}
                taskColumns={taskColumns}
                shadeUntilCurrentTime={true}
                currentTimeIndicator={true}
                className="h-full w-full"
                autoSchedule
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ProjectView;