import { useState } from "react";
import KanbanView from "./kanbanView";
import SideBar from "../layout/SideBar";
import BackgroundImage from "../layout/BackgroundImage";
// import CalendarView from "./calendarView";
// import RulesSetups from "./kanbanView/rulesSetups/rulesSetups";
// import Tasks from "@/pages/tasks";
function TaskViews() {
  const [isSidebarExpanded, setSidebarExpanded] = useState(true);

  const toggleSidebar = () => {
    setSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <>
      <BackgroundImage></BackgroundImage>
      <div className="relative h-full">
        <SideBar
          toggleSidebar={toggleSidebar}
          isSidebarExpanded={isSidebarExpanded}
        />
        <div className={`h-full ${isSidebarExpanded ? "ml-64" : "ml-4"}`}>
         
          {/* <CalendarView /> */}
          {/* <RulesSetups/> */}
          <KanbanView />
          {/* <Tasks/> */}
        </div>
      </div>
    </>
  );
}

export default TaskViews;
