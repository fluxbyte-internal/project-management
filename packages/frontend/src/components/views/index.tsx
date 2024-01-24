import { useEffect, useState } from "react";
import KanbanView from "./kanbanView";
import SideBar from "../layout/SideBar";
import CalendarView from "./calendarView";
import Tasks from "@/pages/tasks";
import useProjectDetail from "@/api/query/useProjectDetailQuery";
import { useParams } from "react-router-dom";
import { ProjectDefaultViewEnumValue } from "@backend/src/schemas/enums";
import kanaban from "../../assets/svg/KanbanView.svg";
// import gantt from "../../assets/svg/Gantt.svg";
import calendar from "../../assets/svg/Calendar.svg";
import list from "../../assets/svg/List.svg";
function TaskViews() {
  const viewOption = [
    {
      icon: list,
      value: ProjectDefaultViewEnumValue.LIST,
    },
    {
      icon: kanaban,
      value: ProjectDefaultViewEnumValue.KANBAN,
    },
    {
      icon: calendar,
      value: ProjectDefaultViewEnumValue.CALENDAR,
    },
    // {
    //   icon: gantt,
    //   value: ProjectDefaultViewEnumValue.GANTT,
    // },
  ];

  const [isSidebarExpanded, setSidebarExpanded] = useState(true);
  const [views, setViews] = useState<string>(viewOption[0].value);

  const toggleSidebar = () => {
    setSidebarExpanded(!isSidebarExpanded);
  };
  const { projectId } = useParams();
  const projectQuery = useProjectDetail(projectId);
  useEffect(() => {
    if (projectQuery.data?.data.data) {
      setViews(projectQuery.data.data.data.defaultView);
    }
  }, [projectQuery.data?.data.data]);

  return (
    <>
      <div className="relative h-full overflow-hidden">
        <SideBar
          toggleSidebar={toggleSidebar}
          isSidebarExpanded={isSidebarExpanded}
        />
        <div
          className={`h-full ${
            isSidebarExpanded ? "ml-64" : "ml-4"
          } flex flex-col`}
        >
          <div className="flex justify-between px-4 py-2 items-center">
            <div className="text-xl font-semibold text-gray-400">Task View</div>
            <div className="overflow-hidden rounded-xl border border-gray-100  p-0.5">
              <ul className="flex items-center gap-2 text-sm font-medium">
                {viewOption.map((item) => {
                  return (
                    <li className="flex-1">
                      <button
                        onClick={() => setViews(item.value)}
                        className={`text-gra relative flex items-center justify-center px-4 py-0.5 h-fit gap-2 rounded-lg  shadow hover:bg-white hover:text-gray-700 ${
                          item.value == views ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <img src={item.icon} className="w-8 h-8" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div className="h-full overflow-hidden px-2">
            {views == ProjectDefaultViewEnumValue.KANBAN && <KanbanView />}
            {views == ProjectDefaultViewEnumValue.LIST && <Tasks />}
            {views == ProjectDefaultViewEnumValue.CALENDAR && <CalendarView />}
          </div>
        </div>
      </div>
    </>
  );
}

export default TaskViews;
