import PieChart, { ChartProps } from "@/components/charts/PieChart";
import Table, { ColumeDef } from "@/components/shared/Table";
import useAdminPortfolioDashboardQuery, {
  DashboardPortfolioDataType,
} from "@/api/query/usePortfolioDashboardQuery";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import dateFormater from "@/helperFuntions/dateFormater";
import { Button } from "@/components/ui/button";
import CreateUpdateProjectForm from "@/components/project/CreateProjectForm";
// import HorizontalBarChart from "@/components/charts/HorizontalBarChart";
import { Project } from "@/api/query/useProjectQuery";
import LinkArrow from "@/assets/svg/linkArrow.svg";
import { ProjectStatusEnumValue } from "@backend/src/schemas/enums";
import { toast } from "react-toastify";
import { Tooltip, TooltipProvider } from "@radix-ui/react-tooltip";
import { TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import InfoCircle from "@/assets/svg/Info circle.svg";
export interface ProjectType {
  projectId: string;
  organisationId: string;
  projectName: string;
  projectDescription: string;
  startDate: string;
  estimatedEndDate: string;
  status: string;
  defaultView: string;
  timeTrack: string;
  budgetTrack: string;
  currency: string;
  overallTrack: string;
  estimatedBudget: string;
  actualCost: string;
  createdByUserId: string;
  updatedByUserId: string;
  createdAt: string;
  updatedAt: string;
}
export interface tableDataType {
  organisationId: string;
  organisationName: string;
  industry: string;
  status: string;
  country: string;
  nonWorkingDays: string[];
  createdAt: string;
  updatedAt: string;
  tenantId: string;
  createdByUserId: string;
  updatedByUserId: string;
  projects: ProjectType[];
}

function AdminDashboard() {
  const admninPortfolioDashboardQuery = useAdminPortfolioDashboardQuery();
  const [datas, setDatas] = useState<DashboardPortfolioDataType>();
  const [statusPieChartProp, setstatusPieChartProp] = useState<ChartProps>();
  const [spiPieChartProp, setSpiPieChartProp] = useState<ChartProps>();
  const [tableData, setTableData] = useState<ProjectType[]>();
  const [isOpenPopUp, setIsOpenPopUp] = useState(false);
  const [editData, setEditData] = useState<Project | undefined>();
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
    toast.warning(
      "Please update tasks progression to have accurate data on dashboard",
      {
        autoClose: false,
        closeOnClick: true,
        className: "bg-primary-400/60 w-fit  text-nowrap",
        style: { left: "-40%" },
      }
    );
  }, []);

  useEffect(() => {
    setDatas(admninPortfolioDashboardQuery?.data?.data?.data);
  }, [admninPortfolioDashboardQuery?.data?.data?.data]);

  useEffect(() => {
    setTableData(datas?.orgCreatedByUser?.projects);
    const statusPieChartData: ChartProps["chartData"] = [];
    datas?.statusChartData?.labels.forEach((name: string, index) => {
      if (Number(datas?.statusChartData?.data[index]) > 0) {
        statusPieChartData.push({
          value: Number(datas?.statusChartData?.data[index]),
          name: formatStatus(name),
        });
      }
    });

    setstatusPieChartProp({
      chartData: statusPieChartData!,
      color: ["#F7B801", "#F18701", "#3D348B", "#7678ED"],
      title: "Projects per status",
      radius: ["45%", "60%"],
      height: "300px",
    });
    const overallSituationPieChartData: ChartProps["chartData"] = [];
    datas?.overallSituationChartData?.labels.forEach((name: string, index) => {
      if (Number(datas?.overallSituationChartData?.data[index]) > 0) {
        overallSituationPieChartData.push({
          value: Number(datas?.overallSituationChartData?.data[index]),
          name: formatStatus(name),
        });
      }
    });
    setOverallStatusPieChartProp({
      chartData: overallSituationPieChartData!,
      color: ["#F7B801", "#F18701", "#3D348B", "#7678ED"],
      title: "Projects per overall situation",
      radius: ["0%", "60%"],
      height: "300px",
    });
    const spiPieChartData: ChartProps["chartData"] = [];
    datas?.spiData?.labels.forEach((name: string, index) => {
      if (Number(datas?.spiData?.data[index]) > 0) {
        spiPieChartData.push({
          value: Number(datas?.spiData?.data[index]),
          name: formatStatus(name),
        });
      }
    });
    setSpiPieChartProp({
      chartData: spiPieChartData!,
      color: ["#FF000077", "#00800077", "#FFB81977"],
      title: "Projects with delays",
      subtext: "Project delays based on task progression",
      radius: ["45%", "60%"],
      height: "300px",
      // title:{
      //   text: 'Referer of a Website',
      //   subtext: 'Fake Data',
      //   left: 'center',
      // },
    });
  }, [datas]);

  // const chartProp2: ChartProps = {
  //   chartData: [],
  //   color: ["#FFD04A", "#FFB819", "#B74E06"],
  //   title: "Project With Delays",
  //   radius: ["45%", "60%"],
  //   height: "300px",
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
      key: "startDate",
      header: "Start Date",
      sorting: true,
      onCellRender: (item) => <>{dateFormater(new Date(item.startDate))}</>,
    },
    {
      key: "estimatedEndDate",
      header: "Estimated End Date",
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
      onCellRender: (item) => (
        <>
          {item.estimatedEndDate && dateFormater(new Date(item.actualEndDate))}
        </>
      ),
    },
    {
      key: "status",
      header: "Status",
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
      key: "actualDuration",
      header: "Actual Duration",
      sorting: true,
    },
    {
      key: "estimatedDuration",
      header: "Est. Duration",
      sorting: true,
    },
    {
      key: "estimatedBudget",
      header: "Budget",
      sorting: true,
    },
  ];
  const close = () => {
    setIsOpenPopUp(false);
    setEditData(undefined);
  };
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
        <div className="text-xl font-bold text-gray-400 px-6">
          Project Status
        </div>
        <div className="w-full h-fit flex flex-col lg:flex-row gap-10 items-center">
          <div className="tabs border-gray-300  w-full rounded-xl h-fit flex flex-col md:flex-row gap-5 items-center px-6 py-5 text-white flex-wrap justify-center">
            {datas?.statusChartData?.labels.map((labelData, index) => (
              <>
                <div
                  key={index}
                  className={`relative flex flex-col gap-2 select-none lg:gap-5 w-full lg:w-1/5 h-1/5 lg:h-full  rounded-2xl p-2 lg:py-3 text-start items-start justify-start px-10 border-l-[12px] ${
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
                    {datas?.statusChartData?.data[index]}
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
        <div className="text-xl font-bold text-gray-400 px-6">Charts</div>
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
          {/* <div className="severity rounded-2xl w-3/4 lg:w-1/4 h-full justify-center items-center  flex gap-2 backdrop-filter backdrop-blur-md bg-opacity-60 border border-gray-300">
            <PieChart chartProps={chartProp4} />
          </div> */}
          {/* <div className="risks rounded-2xl w-3/4 lg:w-1/4 h-full justify-center items-center  flex gap-2 backdrop-filter backdrop-blur-md bg-opacity-60 border border-gray-300">
            <HorizontalBarChart chartProps={chartProp5} />
          </div> */}
        </div>
        <div className="w-full flex flex-col md:flex-col gap-10 justify-center px-5 md:px-20 lg:px-0 self-center">
          <div className="w-full lg:w-4/5 self-center">
            <Button variant={"primary"} onClick={() => setIsOpenPopUp(true)}>
              Add Project
            </Button>
          </div>

          <div className="w-full lg:w-4/5 h-full self-center mb-10">
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
export default AdminDashboard;
