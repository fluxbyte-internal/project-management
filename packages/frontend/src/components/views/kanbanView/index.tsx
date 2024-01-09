import Kanban, {
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
import useTaskStatusUpdateMutation from "@/api/mutation/useTaskStatusUpdateMutation";
import { toast } from "react-toastify";
import TaskFilter, { FIELDS } from "../TaskFilter";
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
  const allTasks = useAllTaskQuery(projectId);

  const [dataSource, setDataSource] = useState<ExtendedKanbanDataSource[]>();
  const [filterData, setFilterData] = useState<Task[]>();

  const close = () => {
    setDialogRendered(undefined);
    setIsTaskShow(false);
    allTasks.refetch();
  };
  const Columns = [
    {
      label: TaskStatusEnumValue.PLANNED,
      dataField: TaskStatusEnumValue.PLANNED,
      width: 300,
    },
    {
      label: TaskStatusEnumValue.TODO,
      dataField: TaskStatusEnumValue.TODO,
      width: 300,
      addNewButton: false,
    },
    {
      label: TaskStatusEnumValue.IN_PROGRESS.replace("_", " "),
      dataField: TaskStatusEnumValue.IN_PROGRESS,
      width: 300,
      addNewButton: false,
    },
    {
      label: TaskStatusEnumValue.DONE,
      dataField: TaskStatusEnumValue.DONE,
      width: 300,
      addNewButton: false,
    },
  ];

  useEffect(() => {
    setDataSource([])
    if (allTasks.data?.data.data) {
      allTasks.data?.data.data?.forEach((task) => {
        setDataSource((prevItems) => [
          ...(prevItems || []),
          DataConvertToKanbanDataSource(task),
        ]);
      });
    }
  }, [allTasks.data?.data.data]);

  useEffect(() => {
    setDataSource([]);
    if (filterData) {
      filterData?.forEach((task) => {
        setDataSource((prevItems) => [
          ...(prevItems || []),
          DataConvertToKanbanDataSource(task),
        ]);
      });
    }
  }, [filterData]);

  const taskStatusUpdateMutation = useTaskStatusUpdateMutation();
  const statusUpdate = (e: (Event & CustomEvent) | undefined) => {
    const data = {
      status: e?.detail.value.status,
      taskId: e?.detail?.value.id,
    };

    taskStatusUpdateMutation.mutate(data, {
      onError(error) {
        allTasks.refetch();
        toast.error(error.response?.data.message);
      },
    });
  };

  function DataConvertToKanbanDataSource(data: Task): ExtendedKanbanDataSource {
    return {
      id: data.taskId,
      color: data.flag,
      text: data.taskName,
      status: data.status,
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

  const onOpening = (e: (Event & CustomEvent) | undefined) => {
    e?.preventDefault();
    if (e?.detail.purpose === "add") {
      setDialogRendered(undefined), setIsTaskShow(true);
    } else {
      setDialogRendered(e?.detail.task.data.id);
    }
  };
  const onTaskRender = (
    taskElement: HTMLElement,
    data: ExtendedKanbanDataSource
  ) => {
    const root = createRoot(taskElement);
    root.render(<TaskShellView taskData={data} />);
  };

  const onColumnHeaderRender = (
    header: HTMLElement,
    data: { dataField: keyof typeof TaskStatusEnumValue }
  ) => {
    const className = [
      "!text-sm",
      "!items-center",
      "!font-bold",
      "!leading-sm",
      "!uppercase",
      "!px-2",
      "!py-0.5",
      "!rounded",
      "!text-gray-600",
    ];
    switch (data.dataField) {
      case TaskStatusEnumValue.PLANNED:
        className.push("!bg-rose-500/20");
        break;
      case TaskStatusEnumValue.TODO:
        className.push("!bg-slate-500/20");
        break;
      case TaskStatusEnumValue.IN_PROGRESS:
        className.push("!bg-primary-500/20");
        break;
      case TaskStatusEnumValue.DONE:
        className.push("!bg-green-500/20");
        break;
    }
    header.classList.add(...className);
  };
  return (
    <div className="h-5/6 w-full scroll ">
      <div>
        <TaskFilter
          fieldToShow={[
            FIELDS.ASSIGNED,
            FIELDS.DATE,
            FIELDS.DUESEVENDAYS,
            FIELDS.FLAGS,
            FIELDS.OVERDUEDAYS,
            FIELDS.TODAYDUEDAYS,
          ]}
          tasks={allTasks.data?.data.data}
          filteredData={(task) => setFilterData(task)}
        />
      </div>
      <Kanban
        ref={childRef}
        {...props}
        columns={Columns}
        dataSource={dataSource}
        collapsible
        addNewButton
        editable
        className="!h-full !w-full"
        taskCustomFields={taskCustomFields}
        onTaskRender={onTaskRender}
        onOpening={(e) => onOpening(e as (Event & CustomEvent) | undefined)}
        onTaskUpdate={(e) =>
          statusUpdate(e as (Event & CustomEvent) | undefined)
        }
        onColumnHeaderRender={onColumnHeaderRender}
      />
      {(dialogRendered || isTaskShow) && (
        <TaskSubTaskForm
          close={close}
          taskId={dialogRendered ?? undefined}
          projectId={projectId}
        />
      )}
    </div>
  );
}

export default KanbanView;
