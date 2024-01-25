import { useState } from "react";
import { Button } from "@/components/ui/button";
import Select, { SingleValue } from "react-select";
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
type Options = { label: string; value: string };


type Filter = {
  tasks: Task[] | undefined;
  fieldToShow: FIELDS[];
  filteredData: (data: Task[] | undefined) => void;
};
type FilterField = {
  assigned: SingleValue<Options> | null;
  tasks: SingleValue<Options> | null;
  dueSevenDays: boolean;
  overdueDays: boolean;
  todayDueDays: boolean;
  date: DateRange | undefined;
  flag: SingleValue<Options> | null;
};
function TaskFilter(props: Filter) {
  const { tasks, fieldToShow } = props;
  const [popOverCLose, setPopOverCLose] = useState(false);
  const [filter, setFilter] = useState<FilterField>({
    assigned: null,
    tasks: null,
    date: undefined,
    dueSevenDays: false,
    overdueDays: false,
    todayDueDays: false,
    flag: null,
  });

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
    const tempData: Task[] = [];
    tasks?.forEach((element) => {
      if (
        element.taskName.search(searchString) >= 0 ||
        element.taskDescription.search(searchString) >= 0
      ) {
        tempData.push(element);
      }
    });
    props.filteredData(tempData);
  };

  const reactSelectStyle = {
    control: (
      provided: Record<string, unknown>,
      state: { isFocused: boolean }
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
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
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
      ({ taskId }) => !uniqueIds.has(taskId) && uniqueIds.add(taskId)
    );
  };

  const ApplyFilter = () => {
    let filteredData: Task[] | undefined = tasks;
    if (filter && filter.flag && filter.flag.value) {
      filteredData = filteredData?.filter(
        (d) => d.flag === filter?.flag?.value
      );
    }

    if (filter && filter.date?.from && filter.date?.to) {
      filteredData = filteredData?.filter((d) => {
        return (
          new Date(d.startDate ?? "") >= (filter?.date?.from ?? new Date()) &&
          new Date(d.startDate ?? "") <= (filter?.date?.to ?? new Date())
        );
      });
    }

    if (filter && filter.assigned && filter.assigned.value) {
      let arr: Task[] | undefined = filteredData;
      filteredData?.forEach((data) => {
        data.assignedUsers.forEach((u: Task["assignedUsers"][number]) => {
          if (u.user.email === filter?.assigned?.value) {
            arr?.push(data);
          }
          else{
            arr =  arr?.filter(u => u.taskId !== data.taskId)
          }
        });
      });
      if (arr) {
        filteredData = arr
      }
    }

    if (filter && filter.dueSevenDays) {
      filteredData = filteredData?.filter((data) =>
        isDateSevenDays(data.endDate)
      );
    }

    if (filter && filter.overdueDays) {
      filteredData = filteredData?.filter((data) =>
        isOverDueDays(data.endDate)
      );
    }

    if (filter && filter.todayDueDays) {
      filteredData = filteredData?.filter((data) =>
        isDueTodayDays(data.endDate)
      );
    }

    if (filter && filter.tasks) {
      let val;
      if (filter.tasks.value === "1") {
        val = filteredData?.filter((data) => !data.parentTaskId);
      }
      if (filter.tasks.value === "2") {
        val = filteredData?.filter((data) => !!data.parentTaskId);
      }
      if (val && val.length > 0) {
        filteredData = filteredData?.concat(val);
      }
    }

    let applyFilter = Object.keys(filter).filter(
      (key) => filter[key as keyof FilterField]
    ).length;

    if (applyFilter !== 0 && filteredData) {
      filteredData = removeDuplicatesById(filteredData);
      props.filteredData(filteredData);
    } else {
      props.filteredData(tasks);
    }

    setPopOverCLose(false);
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
                                checked={filter.dueSevenDays}
                                onChange={(e) =>
                                  setFilter((prev) => ({
                                    ...prev,
                                    dueSevenDays: e.target.checked,
                                  }))
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
                                checked={filter.overdueDays}
                                onChange={(e) =>
                                  setFilter((prev) => ({
                                    ...prev,
                                    overdueDays: e.target.checked,
                                  }))
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
                                checked={filter.todayDueDays}
                                onChange={(e) =>
                                  setFilter((prev) => ({
                                    ...prev,
                                    todayDueDays: e.target.checked,
                                  }))
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
                                {filter.date
                                  ? `${dateFormater(
                                      filter.date.from ?? new Date()
                                    )}-
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
                    )}
                    {fieldToShow.includes(FIELDS.ASSIGNED) && (
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
                          onChange={(e) => {
                            if (e && e.value == "") {
                              setFilter((prev) => ({
                                ...prev,
                                assigned: null,
                              }));
                            } else {
                              setFilter((prev) => ({ ...prev, assigned: e }));
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
                            filter.flag || { label: "Select flag", value: "" }
                          }
                          options={flags}
                          onChange={(e) => {
                            if (e && e.value == "") {
                              setFilter((prev) => ({ ...prev, flag: null }));
                            } else {
                              setFilter((prev) => ({ ...prev, flag: e }));
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
                          value={filter.tasks || { label: "Both", value: "" }}
                          options={taskOption}
                          onChange={(e) => {
                            if (e && e.value == "") {
                              setFilter((prev) => ({ ...prev, tasks: null }));
                            } else {
                              setFilter((prev) => ({ ...prev, tasks: e }));
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskFilter;
