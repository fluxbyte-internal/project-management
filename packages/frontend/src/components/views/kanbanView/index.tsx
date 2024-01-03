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
import { Button } from "@/components/ui/button";
import { SingleValue } from "react-select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import CalendarSvg from "../../../assets/svg/Calendar.svg";
import { DateRange } from "react-day-picker";
import dateFormater from "@/helperFuntions/dateFormater";
import { Calendar } from "@/components/ui/calendar";
import Select from "react-select";

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
type Options = { label: string; value: string };
type ExtendedKanbanDataSource = KanbanDataSource & {
  users: string;
  subTask: number;
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
  const [dataSource, setDataSource] = useState<ExtendedKanbanDataSource[]>();
  const [filterData, setFilterData] = useState<ExtendedKanbanDataSource[]>();

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

  const allTasks = useAllTaskQuery(projectId);
  const [filter, setFilter] = useState<{
    assigned: SingleValue<Options> | null;
    days: SingleValue<Options> | null;
    date: DateRange | undefined;
    flag: SingleValue<Options> | null;
  }>({
    assigned: null,
    date: undefined,
    days: null,
    flag: null,
  });
  const flags: Options[] = [
    { label: "Select flag", value: "null" },
    { label: "Green", value: "Green" },
    { label: "Red", value: "Red" },
    { label: "Orange", value: "Orange" },
  ];
  useEffect(() => {
    setDataSource([]);
    setFilterData([]);
    if (allTasks.data?.data.data) {
      allTasks.data?.data.data.forEach((task) => {
        if (!task.parentTaskId) {
          setDataSource((prevItems) => [
            ...(prevItems || []),
            DataConvertToKanbanDataSource(task),
          ]);
          setFilterData((prevItems) => [
            ...(prevItems || []),
            DataConvertToKanbanDataSource(task),
          ]);
        }
      });
    }
  }, [allTasks.data?.data.data]);

  function isDateSevenDays(inputDate: Date): boolean {
    const currentDate: Date = new Date();
    const sevenDaysAgo: Date = new Date(currentDate);
    sevenDaysAgo.setDate(currentDate.getDate() + 7);
    return new Date(inputDate) <= sevenDaysAgo;
  }
  function isOverDueDays(inputDate: Date): boolean {
    const currentDate: Date = new Date();
    return new Date(inputDate) <= currentDate;
  }
  function isDueTodayDays(inputDate: Date): boolean {
    const currentDate: Date = new Date();
    return new Date(inputDate) === currentDate;
  }
  useEffect(() => {
    let filteredData = dataSource;
    setFilterData(filteredData);
    if (filter && filter.flag && filter.flag.value) {
      filteredData = dataSource?.filter(
        (d) => d.color === filter.flag?.value.toLowerCase()
      );
    } else if (filter && filter.date?.from && filter.date?.to) {
      filteredData = dataSource?.filter((d) => {
        return (
          new Date(d.startDate ?? "") >= (filter.date?.from ?? new Date()) &&
          new Date(d.startDate ?? "") <= (filter.date?.to ?? new Date())
        );
      });
    } else if (filter && filter.assigned && filter.assigned.value) {
      const arr: ExtendedKanbanDataSource[] = [];
      dataSource?.forEach((data) => {
        JSON.parse(data.users)?.forEach((u: Task["assignedUsers"][0]) => {
          if (u.user.email === filter.assigned?.value) {
            arr.push(data);
          }
        });
      });
      filteredData = arr;
    } else if (filter && filter.days?.value == "sevenDay") {
      filteredData = dataSource?.filter((data) =>
        isDateSevenDays(data.dueDate ?? new Date())
      );
    } else if (filter && filter.days?.value == "overDue") {
      filteredData = dataSource?.filter((data) =>
        isOverDueDays(data.dueDate ?? new Date())
      );
    } else if (filter && filter.days?.value == "dueToday") {
      filteredData = dataSource?.filter((data) =>
        isDueTodayDays(data.dueDate ?? new Date())
      );
    }
    setFilterData(filteredData);
  }, [filter]);

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
      color: data.flag.toLowerCase(),
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

  const assignedTask = (): Options[] | undefined => {
    const projectManagerData: Options[] | undefined = [
      { label: "Select assigned user", value: "" },
    ];
    allTasks.data?.data.data.forEach((item) => {
      item.assignedUsers?.forEach((user) => {
        const val = user.user.email;
        if (!projectManagerData.some((i) => i.value === user.user.email)) {
          projectManagerData.push({ label: val, value: val });
        }
      });
    });
    return projectManagerData;
  };
  const reactSelectStyle = {
    control: (
      provided: Record<string, unknown>,
      state: { isFocused: boolean }
    ) => ({
      ...provided,
      border: "1px solid #E7E7E7",
      paddingTop: "0.2rem",
      paddingBottom: "0.2rem",
      zIndex: -1000,
      outline: state.isFocused ? "2px solid #943B0C" : "0px solid #E7E7E7",
      boxShadow: state.isFocused ? "0px 0px 0px #943B0C" : "none",
      "&:hover": {
        outline: state.isFocused ? "2px solid #943B0C" : "0px solid #E7E7E7",
        boxShadow: "0px 0px 0px #943B0C",
      },
    }),
  };
  const dayFilters: Options[] = [
    { label: "Select days", value: "null" },
    { label: "Due Today", value: "dueToday" },
    { label: "Over Due", value: "overDue" },
    { label: "Seven Day", value: "sevenDay" },
  ];
  const onColumnHeaderRender = (
    header: HTMLElement,
    data: { dataField: keyof typeof TaskStatusEnumValue }
  ) => {
    const className = [
      "!text-sm",
      "!inline-flex",
      "!items-center",
      "!font-bold",
      "!leading-sm",
      "!uppercase",
      "!px-2",
      "!py-0.5",
      "!rounded-full",
      "!text-gray-600",
    ];
    switch (data.dataField) {
      case TaskStatusEnumValue.PLANNED:
        className.push("!bg-rose-500/40");
        break;
      case TaskStatusEnumValue.TODO:
        className.push("!bg-slate-500/40");
        break;
      case TaskStatusEnumValue.IN_PROGRESS:
        className.push("!bg-primary-500/40");
        break;
      case TaskStatusEnumValue.DONE:
        className.push("!bg-green-500/40");
        break;
    }
    header.children[1].children[0].classList.add(...className);
  };
  return (
    <div className="h-5/6 w-full scroll ">
      <div className="flex w-full justify-between items-center gap-2">
        <div className="flex justify-between w-full gap-2 text-gray-500 flex-col-reverse md:flex-col lg:flex-row">
          <div className="flex justify-between items-center gap-6 w-full lg:flex-row flex-col z-[2]">
            <div className="w-full">
              <Select
                className="p-0 z-40"
                value={filter.days || { label: "Select days", value: "" }}
                options={dayFilters}
                onChange={(e) => setFilter((prev) => ({ ...prev, days: e }))}
                placeholder="Select days"
                styles={reactSelectStyle}
              />
            </div>
            <div className="w-full">
              <Popover>
                <PopoverTrigger className="w-full">
                  <Button variant={"outline"} className="w-full h-11 py-1">
                    <div className="flex justify-between text-base items-center w-full text-gray-950 font-normal">
                      {filter.date
                        ? `${dateFormater(filter.date.from ?? new Date())}-
                              ${dateFormater(filter.date.to ?? new Date())}`
                        : "Select start date"}
                      <img src={CalendarSvg} width={20} />
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="z-50 bg-white ">
                  <div>
                    <Calendar
                      mode="range"
                      selected={filter.date}
                      onSelect={(e) =>
                        setFilter((prev) => ({ ...prev, date: e }))
                      }
                      className="rounded-md border"
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="w-full">
              <Select
                className="p-0 z-40"
                value={
                  filter.assigned || {
                    label: "Select assigned user",
                    value: "",
                  }
                }
                options={assignedTask()}
                onChange={(e) =>
                  setFilter((prev) => ({ ...prev, assigned: e }))
                }
                placeholder="Select assigned user"
                styles={reactSelectStyle}
              />
            </div>
            <div className="w-full">
              <Select
                className="p-0 z-40"
                value={filter.flag || { label: "Select flag", value: "" }}
                options={flags}
                onChange={(e) => setFilter((prev) => ({ ...prev, flag: e }))}
                placeholder="Select flags"
                styles={reactSelectStyle}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end mr-1">
        <Button
          variant={"primary"}
          onClick={() => {
            setDialogRendered(undefined), setIsTaskShow(true);
          }}
        >
          Create
        </Button>
      </div>
      <Kanban
        ref={childRef}
        {...props}
        columns={Columns}
        dataSource={filterData}
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
