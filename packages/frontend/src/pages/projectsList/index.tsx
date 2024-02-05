import PercentageCircle from "@/components/shared/PercentageCircle";
import Table, { ColumeDef } from "@/components/shared/Table";
import dateFormatter from "@/helperFuntions/dateFormater";
import useProjectQuery, { Project } from "../../api/query/useProjectQuery";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import CreateUpdateProjectForm from "@/components/project/CreateProjectForm";
import NoProject from "../../components/project/NoProject";
import Loader from "@/components/common/Loader";
import UserAvatar from "@/components/ui/userAvatar";
import BackgroundImage from "@/components/layout/BackgroundImage";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollText, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Select, { SingleValue } from "react-select";
import CalendarSvg from "../../assets/svg/Calendar.svg";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { useUser } from "@/hooks/useUser";

type Options = { label: string; value: string };
function ProjectsList() {
  const [data, setData] = useState<Project[]>();
  const [filterData, setFilterData] = useState<Project[]>();
  const [isOpenPopUp, setIsOpenPopUp] = useState(false);
  const [editData, setEditData] = useState<Project | undefined>();
  const [filter, setFilter] = useState<{
    projectManager: SingleValue<Options> | null;
    status: SingleValue<Options> | null;
    date: DateRange | undefined;
  }>({
    projectManager: null,
    status: null,
    date: undefined,
  });
  const { user } = useUser();
  const navigate = useNavigate();

  const projectQuery = useProjectQuery();
  useEffect(() => {
    setData(projectQuery.data?.data.data);
    setFilterData(projectQuery.data?.data.data);
  }, [projectQuery.data?.data.data]);

  const close = () => {
    setIsOpenPopUp(false);
    setEditData(undefined);
  };

  const handleView = (id: string) => {
    navigate("/project-details/" + id);
  };
  const projectManager = (): Options[] | undefined => {
    const projectManagerData: Options[] | undefined = [
      { label: "Select manager", value: "" },
    ];
    data?.forEach((item) => {
      const val = item.createdByUser.email;
      if (
        !projectManagerData.some((i) => i.value == item.createdByUser.email)
      ) {
        projectManagerData.push({ label: val, value: val });
      }
    });

    return projectManagerData;
  };
  const status = (): Options[] | undefined => {
    const statusData: Options[] | undefined = [
      { label: "Select status", value: "" },
    ];
    data?.forEach((item) => {
      if (!statusData.some((i) => i.value == item.status)) {
        statusData.push({ label: item.status, value: item.status });
      }
    });

    return statusData;
  };
  const columnDef: ColumeDef[] = [
    { key: "projectName", header: "Project Name", sorting: true },
    {
      key: "createdByUser",
      header: "Manager",
      onCellRender: (item: Project) => (
        <div className="w-full my-3">
          {item.projectManagerInfo?.length > 0 ? (
            <div className="w-24 grid grid-cols-[repeat(auto-fit,minmax(10px,max-content))] mr-2">
              {item.projectManagerInfo?.slice(0, 3).map((item, index) => {
                const zIndex = Math.abs(index - 2);
                return (
                  <>
                    <div key={index} style={{ zIndex: zIndex }}>
                      <UserAvatar
                        className={`shadow-sm h-7 w-7`}
                        user={item.user}
                      ></UserAvatar>
                    </div>
                  </>
                );
              })}
              {item.projectManagerInfo &&
                item.projectManagerInfo?.length > 3 && (
                  <div className="bg-gray-200/30 w-8  text-lg font-medium h-8 rounded-full flex justify-center items-center">
                    {`${item.projectManagerInfo?.length - 3}+`}
                  </div>
                )}
              {item.projectManagerInfo?.length <= 0 ? "N/A" : ""}
            </div>
          ) : (
            "NA"
          )}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      onCellRender: (item: Project) => (
        <>
          <div className="w-32 h-8 px-3 py-1.5 bg-cyan-100 rounded justify-center items-center gap-px inline-flex">
            <div className="text-cyan-700 text-xs font-medium leading-tight">
              {item.status}
            </div>
          </div>
        </>
      ),
    },
    {
      key: "startDate",
      header: "Start Date",
      sorting: true,
      onCellRender: (item: Project) => (
        <>{dateFormatter(new Date(item.startDate))}</>
      ),
    },
    {
      key: "actualEndDate",
      header: "End Date",
      onCellRender: (item: Project) => (
        <>
          {item.estimatedEndDate &&
            dateFormatter(new Date(item.estimatedEndDate))}
        </>
      ),
    },
    {
      key: "progress",
      header: "Progress",
      onCellRender: (item: Project) => (
        <PercentageCircle percentage={item.progressionPercentage} />
      ),
    },
    {
      key: "estimatedBudget",
      header: "Budget",
      sorting: true,
    },
    {
      key: "Action",
      header: "Action",
      onCellRender: (item: Project) => (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="cursor-pointer w-24 h-8 px-3 py-1.5 bg-white border rounded justify-center items-center gap-px inline-flex">
                <Settings className="mr-2 h-4 w-4" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-11 flex flex-col gap-1">
              {/* <DropdownMenuItem onClick={() => handleEdit(item)}>
                <Edit className="mr-2 h-4 w-4 text-[#44546F]" />
                <span className="p-0 font-normal h-auto" >
                  Edit
                </span>
              </DropdownMenuItem> */}
              <DropdownMenuSeparator className="mx-1" />
              <DropdownMenuItem onClick={() => handleView(item.projectId)}>
                <ScrollText className="mr-2 h-4 w-4 text-[#44546F]" />
                <span className="p-0 font-normal h-auto">View Detail</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ),
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
      zIndex: 1000,
      outline: state.isFocused ? "2px solid #943B0C" : "0px solid #E7E7E7",
      boxShadow: state.isFocused ? "0px 0px 0px #943B0C" : "none",
      "&:hover": {
        outline: state.isFocused ? "2px solid #943B0C" : "0px solid #E7E7E7",
        boxShadow: "0px 0px 0px #943B0C",
      },
    }),
  };
  // const handleEdit = (item: Project) => {
  //   setIsOpenPopUp(true);
  //   setEditData(item);
  // };

  useEffect(() => {
    let filteredData = data;
    if (filter && filter.status && filter.status.value) {
      filteredData = data?.filter((d) => d.status === filter.status?.value);
    }
    if (filter && filter.date?.from && filter.date?.to) {
      filteredData = filteredData?.filter((d) => {
        return (
          new Date(d.estimatedEndDate) >= (filter.date?.from ?? new Date()) &&
          new Date(d.estimatedEndDate) <= (filter.date?.to ?? new Date())
        );
      });
    }
    if (filter && filter.projectManager && filter.projectManager.value) {
      let arr: Project[] | undefined = [];
      filteredData?.forEach((data) => {
        data.projectManagerInfo.forEach((u) => {
          if (u.user.email === filter?.projectManager?.value) {
            arr?.push(data);
          } else {
            arr = arr?.filter((u) => u.projectId !== data.projectId);
          }
        });
      });
      filteredData = arr;
    }

    setFilterData(filteredData);
  }, [filter, data]);

  const reset = () => {
    setFilter({
      projectManager: null,
      date: undefined,
      status: null,
    });
    setFilterData(data);
  };

  return (
    <div className="w-full h-full relative">
      <BackgroundImage />
      {projectQuery.isLoading ? (
        <Loader />
      ) : (
        <>
          {data && data.length > 0 ? (
            <div className="h-full py-5 p-4  w-full flex flex-col gap-5">
              <div className="flex justify-between items-center">
                <h2 className="font-medium text-3xl leading-normal text-gray-600">
                  Projects
                </h2>
                {user?.userOrganisation[0]?.role !== "TEAM_MEMBER" && (
                  <div>
                    <Button
                      variant={"primary"}
                      onClick={() => setIsOpenPopUp(true)}
                    >
                      Add Project
                    </Button>
                  </div>
                )}
              </div>
              {data && (
                <div className="flex justify-around items-center">
                  <div className="w-1/4">
                    <Select
                      className="p-0 z-40"
                      value={
                        filter.projectManager || {
                          label: "Select manager",
                          value: "",
                        }
                      }
                      options={projectManager()}
                      onChange={(e) =>
                        setFilter((prev) => ({ ...prev, projectManager: e }))
                      }
                      placeholder="Select manager"
                      styles={reactSelectStyle}
                    />
                  </div>
                  <div className="w-1/4">
                    <Select
                      value={
                        filter.status || { label: "Select status", value: "" }
                      }
                      className="p-0 z-40"
                      options={status()}
                      onChange={(e) =>
                        setFilter((prev) => ({ ...prev, status: e }))
                      }
                      placeholder="Select status"
                      styles={reactSelectStyle}
                    />
                  </div>
                  <div className="w-1/4">
                    <Popover>
                      <PopoverTrigger className="w-full">
                        <Button
                          variant={"outline"}
                          className="w-full h-11 py-1"
                        >
                          <div className="flex justify-between items-center w-full text-gray-400 font-normal">
                            {filter.date
                              ? `${dateFormatter(
                                  filter.date.from ?? new Date()
                                )}-
                              ${dateFormatter(filter.date.to ?? new Date())}`
                              : "End date"}
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
                  <div>
                    <Button
                      variant={"outline"}
                      className="h-11 py-1 bg-gray-100/50"
                      onClick={reset}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              )}
              <div className="h-[80%]">
                {filterData && (
                  <Table
                    key="Project view"
                    columnDef={columnDef}
                    data={filterData}
                  />
                )}
                {!data && (
                  <div className="flex justify-center p-3 w-full">
                    No projects available
                  </div>
                )}
              </div>
            </div>
          ) : (
            <NoProject />
          )}
          {isOpenPopUp && (
            <CreateUpdateProjectForm
              handleClosePopUp={close}
              editData={editData}
            />
          )}
        </>
      )}
    </div>
  );
}

export default ProjectsList;
