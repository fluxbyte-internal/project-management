import { FormEvent, useEffect, useState } from "react";
import KanbanView from "../../components/kanbanView/";
import {
  dataSource,
  kanbanColumn,
  ganntDataSource,
  calendarDatasource,
  TableColumnData
} from "./dataSource";
import GanttView from "../../components/ganttView";
import Dropdown from "../../components/dropdown";
import CalenderView from "../../components/calenderView";
import ListView from "../../components/listView";
import { CustomEvent } from "interface/customeEvent";
import { KanbanUser } from "smart-webcomponents-react";

function TasksView() {
  const [users, setusers,] = useState<KanbanUser[]>();
  const dropDownOption: string[] = ["Gantt", "Kanban", "Calender", "List",];

  const [viewChange, setViewChange,] = useState<string | undefined>(
    dropDownOption[1]
  );
  useEffect(() => {
    setusers([
      {
        id: 1,
        name: "Andrew",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr5Y-TkjeRslcBNc6Ry0FznitnCZdiB3Duc8Xm2rDGnJdWNg13nZbHvRjeyyW-N4hW3_E&usqp=CAU",
      },
      { id: 5, name: "Anne", image: "../../images/people/anne.png", },
      { id: 2, name: "Janet", image: "../../images/people/janet.png", },
      { id: 3, name: "John", image: "../../images/people/john.png", },
      { id: 4, name: "Laura", image: "../../images/people/laura.png", },
    ]);
  }, []);

  const onViewChange = (
    event: (Event | FormEvent<Element> | undefined) & CustomEvent
  ) => {
    setViewChange(event.detail.label);
  };

  return (
    <div className="h-screen mt-3">
      <div className="flex justify-end">
        <div>
          <div className="relative group ml-14 mb-3">
            <Dropdown
              options={dropDownOption}
              dropDownPosition="bottom"
              selectionMode="one"
              className="combos1"
              onChange={(e: Event | FormEvent<Element> | undefined) =>
                onViewChange(
                  e as (Event | FormEvent<Element> | undefined) & CustomEvent
                )
              }
            ></Dropdown>
          </div>
        </div>
      </div>

      <div className="h-full w-full">
        {viewChange === "Kanban" && (
          <KanbanView
            className="h-full w-full "
            allowColumnEdit={true}
            autoColumnHeight={true}
            // columnActions
            columns={kanbanColumn}
            dataSource={dataSource}
            addNewColumn={true}
            addNewButton={true}
            columnFooter={true}
            columnWidth={300}
            columnColorEntireSurface={true}
            users={users}
            taskActions={true}
            taskProgress={true}
            taskComments={true}
            collapsible={true}
          />
        )}
        {viewChange === "Gantt" && (
          <GanttView
            dataSource={ganntDataSource}
            columnMenu
            shadeUntilCurrentTime={true}
            currentTimeIndicator={true}
          />
        )}
        {viewChange === "Calender" && (
          <CalenderView dataSource={calendarDatasource} />
        )}
        {viewChange === "List" && (
          <ListView columns={TableColumnData} dataSource={dataSource} />
        )}
      </div>
    </div>
  );
}

export default TasksView;
