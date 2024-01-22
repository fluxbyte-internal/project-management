import { useEffect, useState } from "react";
import KanbanView from "./kanbanView";
import SideBar from "../layout/SideBar";
// import CalendarView from "./calendarView";
// import RulesSetups from "./kanbanView/rulesSetups/rulesSetups";
import Tasks from "@/pages/tasks";
import Select from "react-select";
import useProjectDetail from "@/api/query/useProjectDetailQuery";
import { useParams } from "react-router-dom";
import { ProjectDefaultViewEnumValue } from "@backend/src/schemas/enums";
function TaskViews() {

  const selectOption = [
    {
      label: ProjectDefaultViewEnumValue.LIST,
      value: ProjectDefaultViewEnumValue.LIST,
    },
    {
      label: ProjectDefaultViewEnumValue.KANBAN,
      value: ProjectDefaultViewEnumValue.KANBAN,
    },
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

  const [isSidebarExpanded, setSidebarExpanded] = useState(true);
  const [views, setViews] = useState<string>(selectOption[0].value);

  const toggleSidebar = () => {
    setSidebarExpanded(!isSidebarExpanded);
  };
  const { projectId } = useParams();
  const projectQuary = useProjectDetail(projectId);
  useEffect(() => {
    if (projectQuary.data?.data.data) {
      setViews(projectQuary.data.data.data.defaultView);
    }
  }, [projectQuary.data?.data.data]);
  
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
            <Select
              defaultValue={selectOption.find(e => e.value == views)}
              styles={reactSelectStyle}
              options={selectOption}
              onChange={(val) => setViews(val?.value ?? "")}
            />
          </div>
          {/* <CalendarView /> */}
          <div className="h-full overflow-hidden px-2">
            {views == ProjectDefaultViewEnumValue.KANBAN && <KanbanView />}
            {views == ProjectDefaultViewEnumValue.LIST && <Tasks />}
          </div>
        </div>
      </div>
    </>
  );
}

export default TaskViews;
