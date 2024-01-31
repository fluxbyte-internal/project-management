import PieChart, { ChartProps } from "@/components/charts/PieChart";
import Table, { ColumeDef } from "@/components/shared/Table";
import useAdminPortfolioDashboardQuery, {
  DashboardPortfolioDataType,
  Project,
} from "@/api/query/usePortfolioDashboardQuery";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


export interface ProjectType {
  projectId: string
  organisationId: string
  projectName: string
  projectDescription: string
  startDate: string
  estimatedEndDate: string
  status: string
  defaultView: string
  timeTrack: string
  budgetTrack: string
  currency: string
  overallTrack: string
  estimatedBudget: string
  actualCost: string
  createdByUserId: string
  updatedByUserId: string
  createdAt: string
  updatedAt: string
}
export interface tableDataType {
  organisationId: string
  organisationName: string
  industry: string
  status: string
  country: string
  nonWorkingDays: string[]
  createdAt: string
  updatedAt: string
  tenantId: string
  createdByUserId: string
  updatedByUserId: string
  projects: ProjectType[]
}


function AdminDashboard() {
  const admninPortfolioDashboardQuery = useAdminPortfolioDashboardQuery();
  const [datas, setDatas] = useState<DashboardPortfolioDataType>();
  const [statusPieChartProp, setstatusPieChartProp] = useState<ChartProps>();
  const [tableData, setTableData] = useState<ProjectType[]>();
  const [overallStatusPieChartProp, setOverallStatusPieChartProp] =
    useState<ChartProps>();
    
 
  
  
  // const overallSituationPieChartData =
  //   data?.overallSituationChartData?.labels?.map((name, index) => ({
  //     name,
  //     value: data?.overallSituationChartData?.data[index],
  //   }));

  useEffect(() => {
    setDatas(admninPortfolioDashboardQuery?.data?.data?.data); 
  }, [admninPortfolioDashboardQuery?.data?.data?.data]);

  useEffect(() => {
    setTableData(datas?.orgCreatedByUser?.projects);
    const statusPieChartData = datas?.statusChartData?.labels.map(
      (name, index) => ({
        value: Number(datas?.statusChartData?.data[index]),
        name,
      })
    );

    setstatusPieChartProp({
      chartData: statusPieChartData!,
      color: ["#FFD04A", "#FFB819", "#B74E06"],
      title: "Projects Per Status",
    });
    const overallSituationPieChartData =
      datas?.overallSituationChartData?.labels.map((name, index) => ({
        value: Number(datas?.overallSituationChartData?.data[index]),
        name,
      }));
    setOverallStatusPieChartProp({
      chartData: overallSituationPieChartData!,
      color: ["#FFD04A", "#FFB819", "#B74E06"],
      title: "Projects Per Overall Situation",
    });
  }, [datas]);

  const chartProp2: ChartProps = {
    chartData: [],
    color: ["#FFD04A", "#FFB819", "#B74E06"],
    title: "Project With Delays",
  };

  const chartProp4: ChartProps = {
    chartData: [],
    color: ["#FFD04A", "#FFB819", "#B74E06"],
    title: "Projects Per Severity",
  };
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
      key: "estimatedBudget",
      header: "Budget",
      sorting: true,
    },
  ];
  return (
    <>
      <div className="overflow-auto w-full py-2 mt-10 px-2 lg:px-14 flex flex-col gap-10">
        <h2 className="font-medium text-3xl leading-normal text-gray-600">
          Admin Dashboard
        </h2>
        <div className="text-xl font-bold text-gray-400">Project Status</div>
        <div className="tabs w-full rounded-xl h-full flex flex-col md:flex-row gap-5 items-center px-6 py-5 text-white ">
          {datas?.statusChartData?.labels.map((labelData, index) => (
            <>
              <div
                key={index}
                className={`flex flex-col gap-5 w-full lg:w-4/5 h-full  rounded-2xl p-2 py-3 text-start items-start justify-start px-10 border-l-[12px] ${
                  labelData === "ACTIVE"
                    ? "border-primary-600 bg-gradient-to-r  from-primary-500 to-primary-300"
                    : labelData === "ON_HOLD"
                      ? "border-primary-800 bg-gradient-to-r  from-primary-700 to-primary-500"
                      : labelData === "NOT_STARTED"
                        ? "border-primary-950 bg-gradient-to-r  from-primary-900 to-primary-700"
                        : "border-gray-100  bg-gradient-to-r   from-gray-700 to-gray-400"
                }`}
              >

                <a className="text-base font-bold items-end">{labelData}</a>
                <a className="text-5xl font-semibold">
                  {datas?.statusChartData?.data[index]}
                </a>
              </div>
            </>
          ))}
        </div>
        <div className="text-xl font-bold text-gray-400">Charts</div>
        <div className=" w-full h-fit flex flex-col lg:flex-row justify-center items-center gap-6 py-2 ">
          <div className=" rounded-2xl w-full h-full justify-center items-center  flex gap-2 backdrop-filter backdrop-blur-md bg-opacity-60 border border-gray-300">
            <PieChart chartProps={chartProp2} />
          </div>
          <div className=" rounded-2xl w-full h-full justify-center items-center  flex gap-2 backdrop-filter backdrop-blur-md bg-opacity-60 border border-gray-300">
            <PieChart chartProps={overallStatusPieChartProp!} />
          </div>
          <div className=" rounded-2xl w-full h-full justify-center items-center  flex gap-2 backdrop-filter backdrop-blur-md bg-opacity-60 border border-gray-300">
            <PieChart chartProps={chartProp4} />
          </div>
          <div className=" rounded-2xl w-full h-full justify-center items-center flex gap-2 backdrop-filter backdrop-blur-md bg-opacity-60 border border-gray-300  ">
            <PieChart chartProps={statusPieChartProp!} />
          </div>
        </div>
        <div className="w-full flex flex-col md:flex-row gap-10 justify-center">
      
      
          <div className="w-full md:w-4/5 h-full">
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
    </>
  );
}
export default AdminDashboard;
