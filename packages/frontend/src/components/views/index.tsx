import { useState } from "react";
import KanbanView from "./kanbanView";
import SideBar from "../layout/SideBar";
import BackgroundImage from "../layout/BackgroundImage";
// import CalendarView from "./calendarView";
// import RulesSetups from "./kanbanView/rulesSetups/rulesSetups";
import Tasks from "@/pages/tasks";
import Select  from "react-select";
function TaskViews() {
  const [isSidebarExpanded, setSidebarExpanded] = useState(true);

  const toggleSidebar = () => {
    setSidebarExpanded(!isSidebarExpanded);
  };

  const selectOption = [
    {label:"Table",value:"Table"},
    {label:"Kanban",value:"Kanban"},
  ];
  const reactSelectStyle = {
    control: (
      provided: Record<string, unknown>,
      state: { isFocused: boolean }
    ) => ({
      ...provided,
      border: "1px solid #E7E7E7",
      paddingTop: "0.2rem",
      paddingBottom: "0.2rem",
      outline: state.isFocused ? "2px solid #943B0C" : "0px solid #E7E7E7",
      boxShadow: state.isFocused ? "0px 0px 0px #943B0C" : "none",
      "&:hover": {
        outline: state.isFocused ? "1px solid #943B0C" : "1px solid #E7E7E7",
        boxShadow: "0px 0px 0px #943B0C",
      },
    }),
  };
  const [views, setViews] = useState<string>(selectOption[0].value);
  return (
    <>
      <BackgroundImage></BackgroundImage>
      <div className="relative h-full">
        <SideBar
          toggleSidebar={toggleSidebar}
          isSidebarExpanded={isSidebarExpanded}
        />
        <div className={`h-full ${isSidebarExpanded ? "ml-64" : "ml-4"} flex flex-col`}>
          <div className="flex justify-between px-4 py-2 items-center">
            <div className="text-xl font-semibold text-gray-400">
              Task View
            </div>
            <Select defaultValue={selectOption[0]} styles={reactSelectStyle} options={selectOption} onChange={(val)=>setViews(val?.value ?? '')}/>
          </div>
          {/* <CalendarView /> */}
          {/* <RulesSetups/> */}
          <div className="h-full overflow-hidden px-2">
            {views == "Kanban"&&<KanbanView />}
            {views == "Table"&&<Tasks/>}
          </div>
          {/* <Tasks/> */}
        </div>
      </div>
    </>
  );
}

export default TaskViews;
