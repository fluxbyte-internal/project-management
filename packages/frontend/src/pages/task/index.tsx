import { FormEvent, useEffect, useState } from "react";
import KanbanView from "../../components/kanbanView/";
import {
  dataSource,
  kanbanColumn,
  ganntDataSource,
  calendarDatasource,
  TableColumnData,
  taskCustomFields
} from "./dataSource";
import GanttView from "../../components/ganttView";
import Dropdown from "../../components/dropdown";
import CalenderView from "../../components/calenderView";
import ListView from "../../components/listView";
import { CustomEvent } from "interface/customeEvent";
import { KanbanDataSource, KanbanUser } from "smart-webcomponents-react";

function TasksView() {
  const [users, setusers,] = useState<KanbanUser[]>();
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

  const ondrag = (event: Event | undefined) => {
    event;
  };
  const onTaskAdd = (event: Event | undefined) => {
    const id = window.crypto.randomUUID();
    const value = event?.target;
    dataSource.push({ id, ...value, });
  };

  const dropDownOption: string[] = ["Kanban", "Gantt", "Calender", "List",];

  const [viewChange, setViewChange,] = useState<string | undefined>(
    dropDownOption[0]
  );

  const onViewChange = (
    event: (Event | FormEvent<Element> | undefined) & CustomEvent
  ) => {
    setViewChange(event.detail.label);
  };

  const onTaskRender = (task: HTMLElement, data: KanbanDataSource) => {
    let color = "";
    switch (data.status) {
    case "toDo": {
      color = "#0B88DA";
      break;
    }
    case "Vincent van Gogh": {
      color = "#30C1E3";
      break;
    }
    case "Edgar Degas": {
      color = "#34C8BA";
      break;
    }
    case "Shen Zhou": {
      color = "#0D559D";
      break;
    }
    case "Ivan Milev": {
      color = "#39AD69";
      break;
    }
    }
    task.style.background = color;
    task.style.color = "#000";
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
            className="h-full w-full scroll"
            allowColumnEdit={true}
            allowColumnReorder={true}
            autoColumnHeight={true}
            columns={kanbanColumn}
            dataSource={dataSource}
            addNewButton={true}
            addNewColumn={true}
            editable={true}
            taskCustomFields={taskCustomFields}
            onDragging={(e) => ondrag(e)}
            onTaskAdd={(e) => onTaskAdd(e)}
            columnFooter={true}
            columnActions={true}
            columnWidth={300}
            allowColumnRemove={true}
            columnColors={true}
            columnColorEntireSurface={true}
            editMode="singleClick"
            users={users}
            taskActions={true}
            taskProgress={true}
            taskComments={true}
            collapsible={true}
            onTaskRender={onTaskRender}
          />
        )}
        {viewChange === "Gantt" && <GanttView dataSource={ganntDataSource} />}
        {viewChange === "Calender" && (
          <CalenderView
            dataSource={calendarDatasource}
          />
        )}
        {viewChange === "List" && (
          <ListView columns={TableColumnData} dataSource={dataSource} />
        )}
      </div>
    </div>
  );
}

export default TasksView;
