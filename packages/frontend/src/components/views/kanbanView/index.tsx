import Kanban, {
  KanbanColumn,
  KanbanDataSource,
  KanbanProps,
} from "smart-webcomponents-react/kanban";
import { HTMLAttributes, useEffect, useRef, useState } from "react";
import TaskSubTaskForm from "@/components/tasks/taskSubTaskForm";
import { Task } from "@/api/mutation/useTaskCreateMutation";
import useAllTaskQuery from "@/api/query/useAllTaskQuery";
import { useParams } from "react-router-dom";
import "./index.css";
import { createRoot } from "react-dom/client";
import TaskShellView from "./taskShellView";
import { TaskStatusEnumValue } from "@backend/src/schemas/enums";
import { toast } from "react-toastify";
import TaskFilter from "../TaskFilter";
import RulesSetups from "./rulesSetups/rulesSetups";
import { KanbanColumnType } from "@/api/mutation/useKanbanCreateColumn";
import { Button } from "@/components/ui/button";
import useUpdateTaskMutation from "@/api/mutation/useTaskUpdateMutation";
import Dialog from "@/components/common/Dialog";
import RulesForm from "./rulesSetups/rulesForm";
import CrossIcon from "@/assets/svg/CrossIcon.svg";
import SettingIcon from "@/assets/svg/Setting.svg";
import useAllKanbanColumnQuery from "@/api/query/useAllKanbanColumn";
import Loader from "@/components/common/Loader";
import { FIELDS } from "@/api/types/enums";
export interface columnsRenderData {
  label: string;
  dataField: string;
  orientation: string;
  collapsible: boolean;
  collapsed: boolean;
  addNewButton: boolean;
  allowRemove: boolean;
  allowHide: boolean;
  editable: boolean;
  reorder: boolean;
}
export type ExtendedKanbanDataSource = KanbanDataSource & {
  users: string;
  subTask: number;
  mileStone: boolean;
};
function KanbanView(
  props: (HTMLAttributes<Element> & KanbanProps) | undefined
) {
  const [dialogRendered, setDialogRendered] = useState<string | undefined>(
    undefined
  );
  const [isTaskShow, setIsTaskShow] = useState<boolean>(false);
  const childRef = useRef<Kanban>(null);
  const { projectId } = useParams();
  const allKanbanColumn = useAllKanbanColumnQuery(projectId);
  const allTasks = useAllTaskQuery(projectId);
  const { refetch } = useAllKanbanColumnQuery(projectId);
  const [dataSource, setDataSource] = useState<ExtendedKanbanDataSource[]>();
  const [filterData, setFilterData] = useState<Task[]>();
  const [isColumnsOpen, setIsColumnsOpen] = useState<boolean>(false);
  const [Columns, setColumns] = useState<KanbanColumn[]>();
  const [closePopup, setClosePopup] = useState<boolean>(false);
  const [rawData, setRawData] = useState<KanbanColumnType[]>();

  useEffect(() => {
    if (allKanbanColumn.status == "success") {
      setOpen();
    }
  }, [allKanbanColumn.status == "success"]);

  useEffect(() => {
    allTasks.refetch();
    refetch();
  }, [projectId]);

  const close = () => {
    setDialogRendered(undefined);
    setIsTaskShow(false);
    allTasks.refetch();
  };

  useEffect(() => {
    refetch();
  }, [projectId]);

  useEffect(() => {
    if (allKanbanColumn.data?.data.data) {
      allKanbanColumn.data?.data.data.sort(
        (a, b) => (a.percentage ?? 0) - (b.percentage ?? 0)
      );
      handleColumn(allKanbanColumn.data?.data.data);
    }
  }, [allKanbanColumn.data?.data.data]);
  useEffect(() => {
    setDataSource([]);
    if (allTasks.data?.data.data) {
      allTasks.data?.data.data?.forEach((task) => {
        if (!task.milestoneIndicator) {
          setDataSource((prevItems) => [
            ...(prevItems || []),
            DataConvertToKanbanDataSource(task),
          ]);
        }
      });
    }
  }, [allTasks.data?.data.data, Columns]);

  useEffect(() => {
    setDataSource([]);
    if (filterData) {
      filterData?.forEach((task) => {
        if (!task.milestoneIndicator) {
          setDataSource((prevItems) => [
            ...(prevItems || []),
            DataConvertToKanbanDataSource(task),
          ]);
        }
      });
    }
  }, [filterData]);

  const taskStatusUpdateMutation = useUpdateTaskMutation();
  const statusUpdate = (e: (Event & CustomEvent) | undefined) => {
    taskStatusUpdateMutation.mutate(
      {
        completionPecentage: Number(e?.detail.value.status),
        id: e?.detail.value.id,
      },
      {
        onSuccess() {
          allTasks.refetch();
        },
        onError(error) {
          allTasks.refetch();
          toast.error(error.response?.data.message);
        },
      }
    );
  };

  function DataConvertToKanbanDataSource(data: Task): ExtendedKanbanDataSource {
    return {
      id: data.taskId,
      color: data.flag,
      text: data.taskName,
      status: setStatus(data),
      progress: data.completionPecentage ? Number(data.completionPecentage) : 1,
      startDate: data.startDate,
      dueDate: data.dueDate ?? data.endDate,
      users: JSON.stringify(data.assignedUsers),
      subTask:
        allTasks.data?.data.data.filter((i) => data.taskId == i.parentTaskId)
          .length ?? 0,
      comments: data.comments?.map((comment) => {
        return {
          text: comment.commentText,
          time: comment.createdAt,
          userId: comment.commentByUserId,
        };
      }),
      mileStone: data.milestoneIndicator,
    };
  }
  const taskCustomFields = [
    {
      label: "Users",
      dataField: "users",
    },
    {
      label: "Sub task count",
      dataField: "subTask",
    },
  ];

  const setStatus = (task: Task) => {
    let closestNumber = 0;
    if (Columns && Columns.length > 0) {
      for (const num of Columns) {
        if (Number(num.dataField) <= Number(task.completionPecentage)) {
          if (
            closestNumber === 0 ||
            Math.abs(Number(task.completionPecentage) - Number(num.dataField)) <
              Math.abs(Number(task.completionPecentage) - closestNumber)
          ) {
            closestNumber = Number(num.dataField);
          }
        }
      }
    }

    return String(closestNumber);
  };

  const onOpening = (e: (Event & CustomEvent) | undefined) => {
    e?.preventDefault();
    if (e?.detail.purpose === "add") {
      setDialogRendered(undefined), setIsTaskShow(true);
    } else {
      setDialogRendered(e?.detail.value.id);
    }
  };
  const onTaskRender = (
    taskElement: HTMLElement,
    data: ExtendedKanbanDataSource
  ) => {
    const root = createRoot(taskElement);
    root.render(<TaskShellView taskData={data} />);
  };

  const onColumnHeaderRender = (data: {
    dataField: keyof typeof TaskStatusEnumValue;
  }) => {
    const className = "";
    switch (data.dataField) {
    case TaskStatusEnumValue.PLANNED:
      className.concat("!bg-rose-500/20");
      break;
    case TaskStatusEnumValue.TODO:
      className.concat("!bg-slate-500/20");
      break;
    case TaskStatusEnumValue.IN_PROGRESS:
      className.concat("!bg-primary-500/20");
      break;
    case TaskStatusEnumValue.DONE:
      className.concat("!bg-green-500/20");
      break;
    }
    // header.classList.add(...className.split(" "));
  };
  const handleColumn = (data: KanbanColumnType[]) => {
    if (data.length <= 0) {
      setClosePopup(true);
    }
    setRawData(data);
    const column: KanbanColumn[] = data.map((d) => {
      return {
        label: d.name.toUpperCase(),
        dataField: String(d.percentage),
        width: 300,
        addNewButton: d.percentage == 0 ? true : false,
      };
    });
    setColumns(column);
  };
  const onDragging = (e: (Event & CustomEvent) | undefined) => {
    if (e?.detail.data.ItemData.subTask > 0) {
      e?.preventDefault();
    }
  };
  const setOpen = () => {
    if (
      allKanbanColumn.data?.data.data &&
      allKanbanColumn.data.data.data.length > 0
    ) {
      setClosePopup(false);
    } else {
      setClosePopup(true);
    }
  };

  return (
    <div className="w-full h-full scroll p-2">
      {allKanbanColumn.isLoading ||
        (allTasks.isLoading && <Loader className="top-0 right-0" />)}
      {!closePopup && (
        <div className="flex flex-col h-full w-full">
          <div className="flex justify-between  w-full">
            <TaskFilter
              fieldToShow={[
                FIELDS.ASSIGNED,
                FIELDS.DATE,
                FIELDS.DUESEVENDAYS,
                FIELDS.FLAGS,
                FIELDS.OVERDUEDAYS,
                FIELDS.TODAYDUEDAYS,
                FIELDS.TASK,
              ]}
              tasks={allTasks.data?.data.data}
              filteredData={(task) => setFilterData(task)}
            />
            <div className="flex w-full justify-between">
              <div>
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  onClick={() => setClosePopup(true)}
                >
                  <img src={SettingIcon} className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant={"primary"}
                value={"Create Columns"}
                onClick={() => setIsColumnsOpen(true)}
              >
                Create Columns
              </Button>
            </div>
          </div>
          {projectId && (
            <Kanban
              ref={childRef}
              {...props}
              columns={Columns}
              dataSource={dataSource}
              addNewButton
              className="!h-[92%] !w-full kanban"
              taskCustomFields={taskCustomFields}
              onTaskRender={onTaskRender}
              onDragStart={(e) =>
                onDragging(e as (Event & CustomEvent) | undefined)
              }
              onTaskDoubleClick={(e) =>
                onOpening(e as (Event & CustomEvent) | undefined)
              }
              onOpening={(e) =>
                onOpening(e as (Event & CustomEvent) | undefined)
              }
              onTaskUpdate={(e) =>
                statusUpdate(e as (Event & CustomEvent) | undefined)
              }
              onColumnHeaderRender={onColumnHeaderRender}
            />
          )}
        </div>
      )}
      {(dialogRendered || isTaskShow) && Boolean(projectId) && (
        <TaskSubTaskForm
          close={close}
          taskId={dialogRendered ?? undefined}
          projectId={projectId}
        />
      )}
      {closePopup && projectId && (
        <RulesSetups
          key={"RulesSetups#1"}
          setColumes={(data) => handleColumn(data)}
          close={() => {
            setClosePopup(false);
            setOpen();
          }}
        />
      )}
      <Dialog
        isOpen={isColumnsOpen}
        modalClass="rounded-md p-3"
        onClose={() => {}}
      >
        <div className="flex justify-between mb-3">
          <div className="text-lg font-semibold">Create column</div>
          <Button variant={"none"} onClick={() => setIsColumnsOpen(false)}>
            <img src={CrossIcon} />
          </Button>
        </div>
        <RulesForm
          projectId={projectId ?? ""}
          refetch={() => allKanbanColumn.refetch()}
          close={() => setIsColumnsOpen(false)}
          rules={rawData}
        />
      </Dialog>
    </div>
  );
}

export default KanbanView;
