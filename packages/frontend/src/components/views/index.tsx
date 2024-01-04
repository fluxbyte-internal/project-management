import { useState } from "react";
import KanbanView from "./kanbanView";
import SideBar from "../layout/SideBar";
import BackgroundImage from "../layout/BackgroundImage";
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
        <div className={`p-3 h-full ${isSidebarExpanded ? "ml-64" : "ml-4"}`}>
         
          <KanbanView />
        </div>
      </div>
    </>
  );
}

export default TaskViews;
