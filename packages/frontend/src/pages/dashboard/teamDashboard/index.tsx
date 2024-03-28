import PieChart, { ChartProps } from "@/components/charts/PieChart";
import Table, { ColumeDef } from "@/components/shared/Table";
import {} from "@/api/query/usePortfolioDashboardQuery";
import useProjectManagerPortfolioDashboardQuery, {
  managerDashboardPortfolioDataType,
} from "@/api/query/useTeamMemberPortfolioDashboardQuery";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ProjectType } from "../adminDashboard";
// import HorizontalBarChart from "@/components/charts/HorizontalBarChart";
import dateFormater from "@/helperFuntions/dateFormater";
import CreateUpdateProjectForm from "@/components/project/CreateProjectForm";
import { Project } from "@/api/query/useProjectQuery";
import LinkArrow from "@/assets/svg/linkArrow.svg";
import {
  ProjectStatusEnumValue,
  UserRoleEnumValue,
} from "@backend/src/schemas/enums";
import { toast } from "react-toastify";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";
import InfoCircle from "@/assets/svg/Info circle.svg";
import PercentageCircle from "@/components/shared/PercentageCircle";
import UserAvatar from "@/components/ui/userAvatar";

function TeamDashboard() {
  const projectManagerPortfolioDashboardQuery =
    useProjectManagerPortfolioDashboardQuery();
  const [data, setData] = useState<managerDashboardPortfolioDataType>();
  const [statusPieChartProp, setstatusPieChartProp] = useState<ChartProps>();
  const [tableData, setTableData] = useState<ProjectType[]>();
  const [isOpenPopUp, setIsOpenPopUp] = useState(false);
  const [editData, setEditData] = useState<Project | undefined>();
  const [spiPieChartProp, setSpiPieChartProp] = useState<ChartProps>();

  const [overallStatusPieChartProp, setOverallStatusPieChartProp] =
    useState<ChartProps>();

  // const overallSituationPieChartData =
  //   data?.overallSituationChartData?.labels?.map((name, index) => ({
  //     name,
  //     value: data?.overallSituationChartData?.data[index],
  //   }));
  const formatStatus = (status: string): string => {
    return status
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };
  useEffect(() => {
    setData(projectManagerPortfolioDashboardQuery?.data?.data?.data);
  }, [projectManagerPortfolioDashboardQuery?.data?.data?.data]);
  useEffect(() => {
    if (!toast.isActive("toast1")) {
      toast.warning(
        <p>
          Please update Project settings and task progression to have accurate
          data on dashboard
        </p>,
        {
          autoClose: false,
          closeOnClick: true,
          className: "bg-primary-400/60 w-fit  text-nowrap",
          style: { left: "-60%" },
          toastId: "toast1",
        }
      );
    }
  }, []);
  useEffect(() => {
    setTableData(data?.projects);
    const statusPieChartData: ChartProps["chartData"] = [];
    data?.statusChartData?.labels.forEach((name: string, index) => {
      if (Number(data?.statusChartData?.data[index]) > 0) {
        statusPieChartData.push({
          value: Number(data?.statusChartData?.data[index]),
          name: formatStatus(name),
        });
      }
    });

    setstatusPieChartProp({
      chartData: statusPieChartData!,
      color: ["#F7B801", "#F18701", "#3D348B", "#7678ED"],
      title: "Projects Per Status",
      radius: ["45%", "60%"],
      height: "300px",
    });
    const overallSituationPieChartData: ChartProps["chartData"] = [];
    data?.overallSituationChartData?.labels.forEach((name: string, index) => {
      if (Number(data?.overallSituationChartData?.data[index]) > 0) {
        overallSituationPieChartData.push({
          value: Number(data?.overallSituationChartData?.data[index]),
          name: formatStatus(name),
        });
      }
    });
    setOverallStatusPieChartProp({
      chartData: overallSituationPieChartData!,
      color: ["#F7B801", "#F18701", "#3D348B", "#7678ED"],
      title: "Projects Per Overall Situation",
      radius: ["0%", "60%"],
      height: "300px",
    });
    const spiPieChartData: ChartProps["chartData"] = [];
    data?.spiData?.labels.forEach((name: string, index) => {
      if (Number(data?.spiData?.data[index]) > 0) {
        spiPieChartData.push({
          value: Number(data?.spiData?.data[index]),
          name: formatStatus(name),
        });
      }
    });
    setSpiPieChartProp({
      chartData: spiPieChartData!,
      color: ["#FF000077", "#00800077", "#FFB81977"],
      title: "Project With Delays",
      radius: ["45%", "60%"],
      height: "300px",
      subtext: "Project delays based on task progression",
    });
  }, [data]);

  // const chartProp2: ChartProps = {
  //   chartData: [],
  //   color: ["#FFD04A", "#FFB819", "#B74E06"],
  //   title: "Project With Delays",
  //   radius: ["45%", "60%"],
  //   height: "300px",
  // };

  // const chartProp4: ChartProps = {
  //   chartData: [],
  //   color: ["#FFD04A", "#FFB819", "#B74E06"],
  //   title: "Projects Per Severity",
  //   radius: ["70%", "80%"],
  //   height: "500px",
  // };
  // const chartProp5: ChartProps = {
  //   chartData: [],
  //   color: ["#FFD04A", "#FFB819", "#B74E06"],
  //   title: "Risks",
  //   radius: ["70%", "80%"],
  //   height: "500px",
  // };
  const columnDef: ColumeDef[] = [
    {
      key: "projectName",
      header: "Project Name",
      sorting: true,
      onCellRender: (projectData) => {
        return (
          <>
            <Link to={"/projectDashboard/" + projectData?.projectId}>
              {projectData.projectName}
            </Link>
          </>
        );
      },
    },
    {
      key: "CPI",
      header: "CPI",
      sorting: true,
      onCellRender: (item: Project) => (
        <>{item.CPI ? item.CPI.toFixed(2) : (0.0).toFixed(2)} </>
      ),
      onHeaderRender: (item: string) => (
        <>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="flex gap-1 mr-3 items-center">
                {item}
                <img
                  src={InfoCircle}
                  className="h-[16px] w-[16px]"
                  alt="InfoCircle"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">
                  {" "}
                  CPI measures the project’s cost efficiency: CPI&gt;1: Project
                  is under budget; CPI&lt;1: Project is over budget; CPI=1:
                  Project is on budget
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </>
      ),
    },
    {
      key: "createdByUser",
      header: "Project Manager",
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
      key: "createdByUser",
      header: "Team Member",
      onCellRender: (item: Project) => (
        <div className="w-full my-3">
          {item.assignedUsers.filter(
            (d) =>
              d.user.userOrganisation[0].role == UserRoleEnumValue.TEAM_MEMBER
          )?.length > 0 ? (
            <div className="w-24 grid grid-cols-[repeat(auto-fit,minmax(10px,max-content))] mr-2">
              {item.assignedUsers
                ?.filter(
                  (d) =>
                    d.user.userOrganisation[0].role ==
                    UserRoleEnumValue.TEAM_MEMBER
                )
                .slice(0, 3)
                .map((item, index) => {
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
                item.assignedUsers.filter(
                  (d) =>
                    d.user.userOrganisation[0].role ==
                    UserRoleEnumValue.TEAM_MEMBER
                )?.length > 3 && (
                  <div className="bg-gray-200/30 w-8  text-lg font-medium h-8 rounded-full flex justify-center items-center">
                    {`${
                      item.assignedUsers.filter(
                        (d) =>
                          d.user.userOrganisation[0].role ==
                          UserRoleEnumValue.TEAM_MEMBER
                      )?.length - 3
                    }+`}
                  </div>
                )}
              {item.assignedUsers.filter(
                (d) =>
                  d.user.userOrganisation[0].role ==
                  UserRoleEnumValue.TEAM_MEMBER
              )?.length <= 0
                ? "N/A"
                : ""}
            </div>
          ) : (
            "NA"
          )}
        </div>
      ),
    },
    {
      key: "startDate",
      header: "Start Date",
      sorting: true,
      onCellRender: (item) => <>{dateFormater(new Date(item.startDate))}</>,
    },
    {
      key: "estimatedEndDate",
      header: "Estimated End Date",
      sorting: true,
      onCellRender: (item) => (
        <>
          {item.estimatedEndDate &&
            dateFormater(new Date(item.estimatedEndDate))}
        </>
      ),
    },
    {
      key: "actualEndDate",
      header: "Actual End Date",
      sorting: true,
      onCellRender: (item) => (
        <>
          {item.estimatedEndDate
            ? dateFormater(new Date(item.actualEndDate))
            : "N/A"}
        </>
      ),
    },
    {
      key: "status",
      header: "Status",
      sorting: true,
      onCellRender: (item: Project) => (
        <>
          <div
            className={`w-32 h-8 px-3 py-1.5 ${getStatusColor(
              item.status
            )} rounded justify-center items-center gap-px inline-flex`}
          >
            <div className=" text-xs font-medium leading-tight">
              {item.status
                .toLowerCase()
                .replace(/_/g, " ")
                .replace(/\b\w/g, (char) => char.toUpperCase())}
            </div>
          </div>
        </>
      ),
    },
    {
      key: "progressionPercentage",
      header: "Progress",
      sorting: true,
      onCellRender: (item: Project) => (
        <PercentageCircle
          percentage={
            item.progressionPercentage
              ? Number(item.progressionPercentage) * 100
              : 0
          }
        />
      ),
    },
    {
      key: "actualDuration",
      header: "Actual Duration",
      sorting: true,
    },
    {
      key: "estimatedDuration",
      header: "Est. Duration",
      sorting: true,
    },
  ];
  const getStatusColor = (status: string) => {
    switch (status) {
      case ProjectStatusEnumValue.NOT_STARTED:
        return "!bg-slate-500/60 text-white";
      case ProjectStatusEnumValue.ON_HOLD:
        return "!bg-orange-300 text-white";
      case ProjectStatusEnumValue.ACTIVE:
        return "!bg-emerald-500 text-white";
      case ProjectStatusEnumValue.CLOSED:
        return "!bg-red-500 text-white";
    }
  };
  const close = () => {
    setIsOpenPopUp(false);
    setEditData(undefined);
  };
  const navigate = useNavigate();
  const filterRoutes = (item: string) => {
    navigate(`/projects/?status=${item}`);
  };
  return (
    <>
      <div className="overflow-auto w-full py-2 px-2 lg:px-14 flex flex-col gap-10">
        <h2 className="font-medium text-3xl leading-normal text-gray-600">
          Portfolio dashboard
        </h2>
        <div className="text-xl font-bold text-gray-400  px-6">
          Project Status
        </div>
        <div className="w-full h-fit flex flex-col lg:flex-row gap-10 items-center">
          <div className="tabs border-gray-300  w-full rounded-xl h-fit flex flex-col md:flex-row gap-5 items-center px-6 py-5 text-white flex-wrap justify-center">
            {data?.statusChartData?.labels.map((labelData, index) => (
              <>
                <div
                  key={index}
                  className={`relative flex flex-col gap-2 lg:gap-5 w-full lg:w-1/5 h-1/5 lg:h-full  rounded-2xl p-2 lg:py-3 text-start items-start justify-start px-10 border-l-[12px] ${
                    labelData === ProjectStatusEnumValue.ACTIVE
                      ? "text-[#F7B801]  border-2 border-[#F7B801]"
                      : labelData === ProjectStatusEnumValue.ON_HOLD
                      ? "text-[#F18701] border-2 border-[#F18701]"
                      : labelData === ProjectStatusEnumValue.NOT_STARTED
                      ? "text-[#3D348B] border-2 border-[#3D348B]"
                      : "text-[#7678ED] border-2 border-[#7678ED]"
                  }`}
                >
                  <a className="text-base font-bold items-end">
                    {formatStatus(labelData)}
                  </a>
                  <a className="text-4xl lg:text-5xl font-semibold">
                    {data?.statusChartData?.data[index]}
                  </a>
                  <img
                    className=" absolute right-2 bottom-2 h-6 w-6 opacity-50 hover:opacity-100 cursor-pointer"
                    onClick={() => filterRoutes(labelData)}
                    src={LinkArrow}
                  />
                </div>
              </>
            ))}
          </div>
        </div>
        <div className="text-xl font-bold text-gray-400  px-6">Charts</div>
        <div className=" w-full h-fit flex flex-col lg:flex-row justify-center items-center gap-6 py-2 ">
          <div className="situation rounded-2xl w-3/4 lg:w-1/4 h-full justify-center items-center  flex gap-2 backdrop-filter backdrop-blur-md bg-opacity-60 border border-gray-300">
            <PieChart chartProps={overallStatusPieChartProp!} />
          </div>
          <div className="delays rounded-2xl w-3/4 lg:w-1/4 h-fit justify-center items-center  flex gap-2 backdrop-filter backdrop-blur-md bg-opacity-60 border border-gray-300">
            <PieChart chartProps={spiPieChartProp!} />
          </div>

          <div className="status rounded-2xl w-3/4 lg:w-1/4  h-fit justify-center items-center flex gap-2 backdrop-filter backdrop-blur-md bg-opacity-60 border border-gray-300  ">
            <PieChart chartProps={statusPieChartProp!} />
          </div>
          {/* <div className="risks rounded-2xl w-3/4 lg:w-1/4 h-full justify-center items-center  flex gap-2 backdrop-filter backdrop-blur-md bg-opacity-60 border border-gray-300">
            <HorizontalBarChart chartProps={chartProp5} />
          </div> */}
        </div>
        <div className="w-full flex flex-col md:flex-col gap-10 justify-center px-5 md:px-20 lg:px-0 self-center">
          <div className="w-full lg:w-4/5 h-full self-center mb-10 ">
            {tableData && (
              <>
                <Table
                  key="ProjectList view"
                  columnDef={columnDef}
                  data={tableData}
                />
              </>
            )}
          </div>
        </div>
      </div>
      {isOpenPopUp && (
        <CreateUpdateProjectForm handleClosePopUp={close} editData={editData} />
      )}
    </>
  );
}
export default TeamDashboard;