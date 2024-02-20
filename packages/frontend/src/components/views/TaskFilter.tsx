import { useState } from "react";
import { Button } from "@/components/ui/button";
import Select from "react-select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import CalendarSvg from "../../assets/svg/Calendar.svg";
import { DateRange } from "react-day-picker";
import dateFormater from "@/helperFuntions/dateFormater";
import { Calendar } from "@/components/ui/calendar";
import InputText from "@/components/common/InputText";
import { Task } from "@/api/mutation/useTaskCreateMutation";
import FilterIcon from "../../assets/svg/Filter.svg";
import { FIELDS } from "@/api/types/enums";
import FilterResetIcon from "@/assets/svg/FilterReset.svg";
import { useSearchParams } from "react-router-dom";
import { forwardRef, useImperativeHandle } from "react";
type Options = { label: string; value: string };

type Filter = {
  tasks: Task[] | undefined;
  fieldToShow: FIELDS[];
  filteredData: (data: Task[] | undefined) => void;
  view?: string;
};
export type TaskFilterRef = {
  callFilter: () => void;
};
const TaskFilter = forwardRef<TaskFilterRef, Filter>((props, ref) => {
  useImperativeHandle(ref, () => ({
    callFilter() {
      ApplyFilter();
    },
  }));
  const { tasks, fieldToShow } = props;
  const [popOverCLose, setPopOverCLose] = useState(false);
  const [filter, setFilter] = useSearchParams();

  const flags: Options[] = [
    { label: "Select flag", value: "" },
    { label: "Green", value: "Green" },
    { label: "Red", value: "Red" },
    { label: "Orange", value: "Orange" },
  ];

  const taskOption: Options[] = [
    { label: "both", value: "" },
    { label: "Parent task", value: "1" },
    { label: "Sub task", value: "2" },
  ];
  const assignedTask = (): Options[] | undefined => {
    const projectManagerData: Options[] | undefined = [
      { label: "Select assigned user", value: "" },
    ];
    tasks?.forEach((item) => {
      item.assignedUsers?.forEach((user) => {
        const val = user.user.email;
        if (!projectManagerData.some((i) => i.value === user.user.email)) {
          projectManagerData.push({ label: val, value: val });
        }
      });
    });
    return projectManagerData;
  };

  const searchTask = (searchString: string) => {
    let tempData: Task[] = [];
    if (props.view == "LIST") {
      tempData = findParentTasksWithTaskName(tasks ?? [], searchString);
    } else {
      tasks?.forEach((element) => {
        const searchStringLower = searchString.toLowerCase();
        const searchStringUpper = searchString.toUpperCase();
        const taskNameLower = element.taskName.toLowerCase();
        const taskDescriptionLower = element.taskDescription.toLowerCase();
        const taskNameUpper = element.taskName.toUpperCase();
        const taskDescriptionUpper = element.taskDescription.toUpperCase();

        if (
          taskNameLower.includes(searchStringLower) ||
          taskDescriptionLower.includes(searchStringLower) ||
          taskNameUpper.includes(searchStringUpper) ||
          taskDescriptionUpper.includes(searchStringUpper)
        ) {
          tempData.push(element);
        }
      });
    }

    props.filteredData(tempData);
  };
  const checkTaskName = (task: Task, name: string): boolean => {
    if (task.taskName.toLowerCase().includes(name.toLowerCase())) {
      return true;
    }
    if (task.subtasks && task.subtasks.length > 0) {
      return task.subtasks.some((subtask) => checkTaskName(subtask, name));
    }
    return false;
  };

  function findParentTasksWithTaskName(tasks: Task[], name: string): Task[] {
    const searchName = name.toLowerCase();
    return tasks.filter((task) => checkTaskName(task, searchName));
  }
  const reactSelectStyle = {
    control: (
      provided: Record<string, unknown>,
      state: { isFocused: boolean },
    ) => ({
      ...provided,
      border: "1px solid #E7E7E7",
      paddingTop: "0rem",
      paddingBottom: "0rem",
      outline: state.isFocused ? "2px solid #943B0C" : "0px solid #E7E7E7",
      boxShadow: state.isFocused ? "0px 0px 0px #943B0C" : "none",
      "&:hover": {
        outline: state.isFocused ? "2px solid #943B0C" : "0px solid #E7E7E7",
        boxShadow: "0px 0px 0px #943B0C",
      },
    }),
  };

  function isDateSevenDays(inputDate: Date): boolean {
    const sevenDaysAgo: Date = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() + 7);
    return new Date(inputDate) <= sevenDaysAgo;
  }

  function isOverDueDays(inputDate: Date): boolean {
    const currentDate: Date = new Date();
    return new Date(inputDate) <= currentDate;
  }

  function isDueTodayDays(inputDate: Date): boolean {
    const currentDate: Date = new Date();
    return dateFormater(new Date(inputDate)) === dateFormater(currentDate);
  }

  const removeDuplicatesById = (arr: Task[]) => {
    const uniqueIds = new Set();
    return arr.filter(
      ({ taskId }) => !uniqueIds.has(taskId) && uniqueIds.add(taskId),
    );
  };
  const [filterApplyed, setFilterApplied] = useState(false);
  const ApplyFilter = () => {
    let filteredData: Task[] | undefined = tasks;
    if (filter && Boolean(filter.get("flag"))) {
      filteredData = filteredData?.filter((d) => d.flag == filter?.get("flag"));
    }

    if (
      filter.size &&
      Boolean(filter.get("from")) &&
      Boolean(filter.get("to"))
    ) {
      filteredData = filteredData?.filter((d) => {
        return (
          new Date(d.startDate ?? "") >=
            new Date(filter?.get("from") ?? new Date()) &&
          new Date(d.startDate ?? "") <=
            new Date(filter?.get("to") ?? new Date())
        );
      });
    }

    if (filter && filter.get("assigned") && filter.get("assigned")) {
      let arr: Task[] | undefined = [];
      filteredData?.forEach((data) => {
        data.assignedUsers.forEach((u: Task["assignedUsers"][number]) => {
          if (u.user.email === filter.get("assigned")) {
            arr?.push(data);
          } else {
            arr = arr?.filter((u) => u.taskId !== data.taskId);
          }
        });
      });
      if (arr) {
        filteredData = arr;
      }
    }

    if (filter && filter.get("dueSevenDays")) {
      filteredData = filteredData?.filter((data) =>
        isDateSevenDays(data.endDate),
      );
    }

    if (filter && filter.get("overdueDays")) {
      filteredData = filteredData?.filter((data) =>
        isOverDueDays(data.endDate),
      );
    }

    if (filter && filter.get("todayDueDays")) {
      filteredData = filteredData?.filter((data) =>
        isDueTodayDays(data.endDate),
      );
    }

    if (filter && filter.get("tasks")) {
      let val;
      if (filter.get("tasks") === "1") {
        val = filteredData?.filter((data) => !data.parentTaskId);
      }
      if (filter.get("tasks") === "2") {
        val = filteredData?.filter((data) => !!data.parentTaskId);
      }
      if (val && val.length > 0) {
        filteredData = val;
      }
    }

    let applyFilter = 0;
    filter.forEach((e) => {
      if (Boolean(e) || e !== "false") {
        applyFilter++;
      }
    });

    if (applyFilter !== 0 && filteredData) {
      setFilterApplied(true);
      filteredData = removeDuplicatesById(filteredData);
      props.filteredData(filteredData);
    } else {
      props.filteredData(tasks);
      setFilterApplied(false);
    }

    setPopOverCLose(false);
  };
  const resetFilter = () => {
    setFilterApplied(false);
    setFilter({});
    props.filteredData(tasks);
  };
  const setParamFilter = (key: string, value: string) => {
    filter.set(key, value);
    setFilter(filter);
    if ((value == "undefined" && !value) || value == "false") {
      filter.delete(key);
      setFilter(filter);
    }
  };

  const selectedDate = () => {
    const formDate = filter.get("from");
    const toDate = filter.get("to");
    const data: DateRange = { from: new Date(), to: new Date() };
    if (Boolean(formDate) && formDate !== "undefined" && formDate !== null) {
      data.from = new Date(formDate);
    }
    if (Boolean(toDate) && toDate !== "undefined" && toDate !== null) {
      data.to = new Date(toDate);
    }
    return data;
  };

  return (
    <div>
      <div className="flex w-full justify-between items-center gap-2">
        <div className="flex justify-between w-full gap-2 text-gray-500">
          <div className="flex justify-between items-center gap-6 px-3 w-full ">
            <div className="w-full">
              <InputText
                className="mt-0 h-10 w-56"
                onChange={(e) => searchTask(e.target.value)}
                placeholder="Search task"
              />
            </div>
            <div>
              <Popover open={popOverCLose}>
                <PopoverTrigger className="w-full">
                  <Button
                    variant={"outline"}
                    className="w-fit h-8 rounded px-2"
                    onClick={() => setPopOverCLose(!popOverCLose)}
                  >
                    <div className="flex items-center justify-between gap-2">
                      Filters{" "}
                      <div className="w-3 h-3">
                        <img src={FilterIcon} />
                      </div>
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="z-50 bg-white shadow-lg mr-5">
                  <div className="p-3 w-80 flex flex-col gap-3 !z-50">
                    <div>
                      <div className="text-lg font-semibold">Filter</div>
                      <hr />
                    </div>
                    <div className="w-full flex flex-col gap-3">
                      {fieldToShow.includes(FIELDS.DUESEVENDAYS) && (
                        <div className="flex justify-between items-center">
                          <div>Due in 7 day</div>
                          <div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                name="sevenDays"
                                checked={
                                  filter.get("dueSevenDays") == "true"
                                    ? true
                                    : false
                                }
                                onChange={(e) =>
                                  setParamFilter(
                                    "dueSevenDays",
                                    String(e.target.checked),
                                  )
                                }
                                className="sr-only peer"
                              />
                              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-600 dark:peer-focus:ring-primary-400 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary-400"></div>
                            </label>
                          </div>
                        </div>
                      )}
                      {fieldToShow.includes(FIELDS.OVERDUEDAYS) && (
                        <div className="flex justify-between items-center">
                          <div>Over Due</div>
                          <div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                name="dueDays"
                                checked={
                                  filter.get("overdueDays") == "true"
                                    ? true
                                    : false
                                }
                                onChange={(e) =>
                                  setParamFilter(
                                    "overdueDays",
                                    String(e.target.checked),
                                  )
                                }
                                className="sr-only peer"
                              />
                              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2  peer-focus:ring-primary-600 dark:peer-focus:ring-primary-400 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary-400"></div>
                            </label>
                          </div>
                        </div>
                      )}
                      {fieldToShow.includes(FIELDS.TODAYDUEDAYS) && (
                        <div className="flex justify-between items-center">
                          <div>Due by today</div>
                          <div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                name="todayDays"
                                checked={
                                  filter.get("todayDueDays") == "true"
                                    ? true
                                    : false
                                }
                                onChange={(e) =>
                                  setParamFilter(
                                    "todayDueDays",
                                    String(e.target.checked),
                                  )
                                }
                                className="sr-only peer"
                              />
                              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-600 dark:peer-focus:ring-primary-400 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary-400"></div>
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                    {fieldToShow.includes(FIELDS.DATE) && (
                      <div className="w-full">
                        <Popover>
                          <PopoverTrigger className="w-full">
                            <Button
                              variant={"outline"}
                              className="w-full h-10 rounded p-0 px-2"
                            >
                              <div className="flex justify-between text-base items-center w-full text-gray-950 font-normal">
                                {Boolean(filter.get("from")) &&
                                Boolean(filter.get("to"))
                                  ? `${dateFormater(
                                      new Date(
                                        filter.get("from") ?? new Date(),
                                      ),
                                    )}-
                          ${dateFormater(
                            new Date(filter.get("to") ?? new Date()),
                          )}`
                                  : "Select start date"}
                                <img src={CalendarSvg} width={20} />
                              </div>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="z-50 bg-white ">
                            <div>
                              <Calendar
                                mode="range"
                                selected={selectedDate()}
                                onSelect={(e) => {
                                  e?.from
                                    ? setParamFilter("from", String(e?.from))
                                    : "",
                                    e?.to
                                      ? setParamFilter("to", String(e?.to))
                                      : "";
                                }}
                                className="rounded-md border"
                              />
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}
                    {fieldToShow.includes(FIELDS.ASSIGNED) && (
                      <div className="w-full">
                        <Select
                          className="p-0 z-40"
                          value={
                            filter.get("assigned")
                              ? {
                                  label: filter.get("assigned"),
                                  value: filter.get("assigned"),
                                }
                              : {
                                  label: "Select assigned user",
                                  value: "",
                                }
                          }
                          options={assignedTask()}
                          onChange={(e) => {
                            if (e && e.value == "") {
                              setParamFilter("assigned", "");
                            } else {
                              setParamFilter("assigned", String(e?.value));
                            }
                          }}
                          placeholder="Select assigned user"
                          styles={reactSelectStyle}
                        />
                      </div>
                    )}
                    {fieldToShow.includes(FIELDS.FLAGS) && (
                      <div className="w-full">
                        <Select
                          className="p-0 "
                          value={
                            filter.get("flag")
                              ? {
                                  label: filter.get("flag"),
                                  value: filter.get("flag"),
                                }
                              : { label: "Select flag", value: "" }
                          }
                          options={flags}
                          onChange={(e) => {
                            if (e && e.value == "") {
                              setParamFilter("flag", "");
                            } else {
                              setParamFilter("flag", String(e?.value));
                            }
                          }}
                          placeholder="Select flags"
                          styles={reactSelectStyle}
                        />
                      </div>
                    )}
                    {fieldToShow.includes(FIELDS.TASK) && (
                      <div className="w-full">
                        <Select
                          className="p-0 "
                          value={
                            filter.get("tasks")
                              ? {
                                  label: filter.get("tasks"),
                                  value: filter.get("tasks"),
                                }
                              : { label: "Both", value: "" }
                          }
                          options={taskOption}
                          onChange={(e) => {
                            if (e && e.value == "") {
                              setParamFilter("tasks", "");
                            } else {
                              setParamFilter("tasks", String(e?.value));
                            }
                          }}
                          placeholder="Select Task"
                          styles={reactSelectStyle}
                        />
                      </div>
                    )}
                    {fieldToShow.length != 0 && (
                      <div className="w-full flex gap-2">
                        <Button
                          className="w-full mt-4"
                          variant={"destructive"}
                          onClick={() => setPopOverCLose(false)}
                        >
                          Close
                        </Button>
                        <Button
                          className="w-full mt-4"
                          variant={"primary_outline"}
                          onClick={ApplyFilter}
                        >
                          Apply
                        </Button>
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            {filterApplyed && (
              <div>
                <Button
                  size={"sm"}
                  className="w-fit h-8 rounded px-2"
                  variant={"outline"}
                  onClick={resetFilter}
                >
                  <div className="flex items-center justify-between gap-2">
                    Reset
                    <div className="w-3 h-3">
                      <img src={FilterResetIcon} />
                    </div>
                  </div>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default TaskFilter;
