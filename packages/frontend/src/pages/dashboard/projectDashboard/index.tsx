import useProjectDashboardQuery, {
  projectDashboardPortfolioDataType,
} from "@/api/query/useProjectDashboardQuery";
import PieChart, { ChartProps } from "@/components/charts/PieChart";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dateFormatter from "@/helperFuntions/dateFormater";
import Sunny from "@/assets/png/Sunny.png";
import Cloudy from "@/assets/png/Cloudy.png";
import Rainy from "@/assets/png/Rainy.png";
import Stormy from "@/assets/png/Stormy.png";
import {
  OverAllTrackEnumValue,
  ScheduleAndBudgetTrend,
} from "@backend/src/schemas/enums";
import Increasing from "@/assets/increase.svg";
import Decreasing from "@/assets/decrease.svg";
import Stable from "@/assets/stable.svg";
import LinkArrow from "@/assets/svg/linkArrow.svg";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import InfoCircle from "@/assets/svg/Info circle.svg";
import dateFormater from "@/helperFuntions/dateFormater";

export type ThemeColorData = {
  theme: string;
  colors: {
    tabTexts: string;
    tabGradient: string;
    tabBorders: string;
    mainTexts: string;
    subTexts: string;
    chartColors: string[];
    chartGradient: string;
    chartBorders: string;
    chartHeadingTexts: string;
  };
};
function ProjectDashboard() {
  const [data, setData] = useState<projectDashboardPortfolioDataType>();
  const [selectedStatusTheme, setSelectedStatusTheme] =
    useState<ThemeColorData>();
  const [statusPieChartProp, setstatusPieChartProp] = useState<ChartProps>();
  const [barChartProp, setBarChartProp] = useState<ChartProps>();
  const projectId = useParams()?.projectId;
  const projectDashboardQuery = useProjectDashboardQuery(projectId);

  const colorThemeArr: ThemeColorData[] = [
    {
      theme: OverAllTrackEnumValue.SUNNY,
      colors: {
        tabTexts: "text-white",
        tabGradient: "bg-gradient-to-r  from-primary-500 to-primary-300",
        tabBorders: "border-primary-900 ",
        mainTexts: "text-primary-800",
        subTexts: "text-primary-800",
        chartColors: ["#3D348B", "#F7B801", "#F18701"],
        chartGradient: "",
        chartBorders: "border border-gray-500",
        chartHeadingTexts: "#000000",
      },
    },
    {
      theme: OverAllTrackEnumValue.CLOUDY,
      colors: {
        tabTexts: "text-white",
        tabGradient: "bg-gradient-to-r  from-gray-500 to-gray-300",
        tabBorders: "border-gray-900 ",
        mainTexts: "text-gray-500",
        subTexts: "text-gray-800",
        chartColors: ["#FFD04A", "#FFB819", "#B74E06"],
        chartGradient: "bg-gradient-to-r from-gray-400 to-gray-200 ",
        chartBorders: "border border-gray-300",
        chartHeadingTexts: "#000000",
      },
    },
    {
      theme: OverAllTrackEnumValue.RAINY,
      colors: {
        tabTexts: "text-white",
        tabGradient: "bg-gradient-to-r  from-gray-500 to-gray-300",
        tabBorders: "border-cyan-500 ",
        mainTexts: "text-gray-500",
        subTexts: "text-cyan-300",
        chartColors: ["#cffafe", "#6fe9f9", "#06b6d4"],
        chartGradient: "",
        chartBorders: "border border-gray-300",
        chartHeadingTexts: "#000000",
      },
    },
    {
      theme: OverAllTrackEnumValue.STORMY,
      colors: {
        tabTexts: "text-white",
        tabGradient: "bg-gradient-to-r  from-gray-500 to-gray-300",
        tabBorders: "border-cyan-500 ",
        mainTexts: "text-gray-500",
        subTexts: "text-primary-300",
        chartColors: ["#FFD04A", "#7becff", "#06b6d4"],
        chartBorders: "border border-gray-300",
        chartGradient: "",
        chartHeadingTexts: "#000000",
      },
    },
  ];
  const setTheme = () => {
    // if (data && colorThemeArr) {
    //   const statusThemeData = colorThemeArr.find(
    //     (key) => key?.theme === data?.projectOverAllSituation
    //   );
    // }
    setSelectedStatusTheme(colorThemeArr[0]);
  };

  useEffect(() => {
    setData(projectDashboardQuery?.data?.data?.data);
  }, [projectDashboardQuery?.data?.data?.data]);

  useEffect(() => {
    setTheme();
  }, [data]);
  useEffect(() => {
    if (selectedStatusTheme) {
      const statusPieChartData = data?.taskStatusChartData?.labels.map(
        (name: string, index) => ({
          value: Number(data?.taskStatusChartData?.data[index]),
          name: formatStatus(name),
        })
      );
      if (statusPieChartData) {
        setstatusPieChartProp({
          chartData: statusPieChartData,
          color: selectedStatusTheme?.colors.chartColors,
          title: "Tasks by status",
          height: "100%",
          radius: ["0%", "70%"],
        });
      }
      const delayCounts = {
        red: 0,
        green: 0,
        orange: 0,
      };
      data?.taskDelayChartData?.forEach((task) => {
        if (task.tpiFlag === "Red") {
          delayCounts.red += 1;
        } else if (task.tpiFlag === "Green") {
          delayCounts.green += 1;
        } else if (task.tpiFlag === "Orange") {
          delayCounts.orange += 1;
        }
      });
      setBarChartProp({
        chartData: [
          {
            value: delayCounts.red,
            name: "Red",
          },
          {
            value: delayCounts.green,
            name: "Green",
          },
          {
            value: delayCounts.orange,
            name: "Orange",
          },
        ],
        color: ["#FF000077", "#00800077", "#FFB81977"],
        title: "Tasks by progression",
        height: "100%",
        radius: ["0%", "70%"],
      });
    }
  }, [selectedStatusTheme, projectDashboardQuery?.data?.data?.data]);
  const formatStatus = (status: string): string => {
    console.log(status);
    if (status) {
      return status
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());
    } else {
      return "";
    }
  };
  const navigate = useNavigate();
  const filterRoutes = (item: string) => {
    switch (item) {
      case "Milestones":
        navigate(`/tasks/${projectId}?milestones=true`);
        break;
      case "Tasks":
        navigate(`/tasks/${projectId}`);
        break;
      case "Members":
        navigate(`/members/${projectId}`);
        break;
      default:
        break;
    }
  };
  const getSPI = () => {
    if (data && data.spi) {
      return data.spi;
    } else {
      return 0;
    }
  };
  return (
    <>
      {selectedStatusTheme && data && (
        <>
          <div className="overflow-auto w-full self-center py-2  px-5 lg:px-24 flex flex-col gap-10">
            <h2 className="font-medium text-3xl leading-normal text-gray-600">
              {data.projectName}
            </h2>
            <div className="statsbox w-full h-fit flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-32 py-2 ">
              <div
                className={`items-start relative flex-col bg-gradient-to-r  from-[#3D348B] to-[#8d7eff] ${selectedStatusTheme?.colors.tabTexts} border-l-[12px]  rounded-2xl w-full h-full justify-center px-6 py-3 flex gap-5 backdrop-filter cursor-pointer  border-[#2d2348]  `}
              >
                <div className="text-lg ">No. of Team Members</div>
                <div className="text-4xl font-semibold">
                  {data.numTeamMembersWorkingOnTasks}
                </div>
                <img
                  className=" absolute right-2 bottom-2 h-6 w-6 opacity-70 hover:opacity-100 cursor-pointer invert sepia-[0%] saturate-[7426%] hue-rotate-[16deg] brightness-[100%] contrast-[100%]" // onClick={() => filterRoutes(labelData)}
                  src={LinkArrow}
                  onClick={() => filterRoutes("Members")}
                />
              </div>

              <div
                className={`items-start relative flex-col ${selectedStatusTheme?.colors.tabTexts} border-l-[12px]  bg-gradient-to-r from-[#F7B801] to-primary-500  rounded-2xl w-full h-full justify-center px-6 py-3 flex gap-5 backdrop-filter cursor-pointer  ${selectedStatusTheme?.colors.tabBorders} `}
              >
                <div className="text-lg ">No. of Tasks</div>
                <div className="text-4xl font-semibold">{data.numTasks}</div>
                <img
                  className=" absolute right-2 bottom-2 h-6 w-6 opacity-70 hover:opacity-100 cursor-pointer invert sepia-[0%] saturate-[7426%] hue-rotate-[16deg] brightness-[100%] contrast-[100%]"
                  onClick={() => filterRoutes("Tasks")}
                  src={LinkArrow}
                />
              </div>
              <div
                className={`items-start relative flex-col ${selectedStatusTheme?.colors.tabTexts} border-l-[12px]  bg-gradient-to-r  from-[#7678ED] to-[#bba5e5] rounded-2xl w-full h-full justify-center px-6 py-3 flex gap-5 backdrop-filter cursor-pointer  border-[#2d2348]`}
              >
                <div className="text-lg ">No. of Milestones</div>
                <div className="text-4xl font-semibold">
                  {data.numMilestones}
                </div>
                <img
                  className=" absolute right-2 bottom-2 h-6 w-6 opacity-70 hover:opacity-100 cursor-pointer invert sepia-[0%] saturate-[7426%] hue-rotate-[16deg] brightness-[100%] contrast-[100%]"
                  onClick={() => filterRoutes("Milestones")}
                  src={LinkArrow}
                />
              </div>
            </div>
            <div className="datesDiv w-full flex flex-col md:flex-row lg:flex-col gap-1 md:gap-6 justify-center items-center py-3">
              <div className=" w-full h-full flex flex-col md:flex-row items-center justify-center gap-0 md:gap-5 border-b-0 lg:border-b-2 border-primary-200">
                <div className="w-full  text-center text-base md:text-lg font-semibold flex flex-col gap-2  border-b-2 border-primary-200 md:border-b-0 p-[10px] md:p-0">
                  <div>Creation Date</div>
                  <div className="text-lg md:text-xl font-bold text-gray-500">
                    {dateFormatter(
                      new Date(data?.projectDates?.projectCreatedAt)
                    )}
                  </div>
                </div>
                <div className="w-full  text-center text-base md:text-lg font-semibold flex flex-col gap-2 border-b-2 border-primary-200 md:border-b-0 p-[10px] md:p-0">
                  <div>Start Date</div>
                  <div className="text-lg md:text-xl font-bold text-gray-500">
                    {dateFormatter(new Date(data?.projectDates?.startDate))}
                  </div>
                </div>
              </div>
              <div className="w-full h-full flex flex-col md:flex-row items-center justify-center gap-0 md:gap-5">
                <div className="w-full  text-center text-base md:text-lg font-semibold flex flex-col gap-2 border-b-2 border-primary-200 md:border-b-0 p-[10px] md:p-0">
                  <div>Estimates end date</div>
                  <div className="text-lg md:text-xl font-bold text-gray-500">
                    {dateFormatter(
                      new Date(data?.projectDates?.estimatedEndDate)
                    )}
                  </div>
                </div>
                <div className="w-full  text-center text-base md:text-lg font-semibold flex flex-col gap-2 border-b-2 border-primary-200 md:border-b-0 p-[10px] md:p-0">
                  <div>Actual End Date</div>
                  <div className="text-lg md:text-xl font-bold text-gray-500">
                    {dateFormatter(new Date(data?.projectDates?.actualEndDate))}
                  </div>
                </div>

                <div className="w-full  text-center text-base md:text-lg font-semibold flex flex-col gap-2 border-b-2 border-primary-200 md:border-b-0 p-[10px] md:p-0">
                  <div>Estimated duration</div>
                  <div className="text-lg md:text-xl font-bold text-gray-500">
                    {data?.projectDates?.estimatedDuration ?? 0} Days
                  </div>
                </div>
                <div className="w-full  text-center text-base md:text-lg font-semibold flex flex-col gap-2 border-b-2 border-primary-200 md:border-b-0 p-[10px] md:p-0">
                  <div>Actual Duration</div>
                  <div className="text-lg md:text-xl font-bold text-gray-500">
                    {data?.projectDates?.actualDuration ?? 0} Days
                  </div>
                </div>
              </div>
            </div>
            <div className="databox relative w-full h-fit flex  justify-center items-center  border-2 border-gray-500 rounded-2xl">
              <div className="statsboxDiv w-full h-full overflow-hidden relative flex flex-col lg:flex-row gap-6  py-2 rounded-2xl">
                <div className="progress w-full lg:w-2/3 flex justify-center items-center gap-6 py-2">
                  <div className="w-fit h-fit">
                    <div className="w-full flex flex-col items-center justify-center">
                      <div className="text-xl font-semibold">
                        Project progress
                      </div>
                      <div
                        className="h-[100px] w-[100px] rounded-full flex justify-center items-center mt-2"
                        role="progressbar"
                        aria-valuenow={75}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        style={{
                          background: `radial-gradient(closest-side, white 79%, transparent 80% 100%), conic-gradient(${
                            selectedStatusTheme?.colors?.chartColors[0]
                          } ${
                            Number(
                              Number(data?.projectProgression).toFixed(2)
                            ) * 100
                          }%, #cecece 0)`,
                        }}
                      >
                        <div className="m-1">
                          {data?.projectProgression
                            ? Number(
                                Number(data?.projectProgression).toFixed(2)
                              ) *
                                100 +
                              "%"
                            : "NA"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-5 w-full h-full items-center justify-center text-center ">
                  <div className="text-xl font-semibold">Project Status</div>
                  <div
                    className={`text-4xl font-semibold ${selectedStatusTheme?.colors?.mainTexts}`}
                  >
                    {formatStatus(data?.projectStatus)}
                  </div>
                </div>
                <div className="w-full h-full lg:pr-10">
                  <div className="flex flex-col gap-1 md:gap-3 w-full h-full text-center text-2xl md:text-3xl font-medium items-center justify-center">
                    <div className="text-base md:text-lg ">
                      Project OverAll Status
                    </div>
                    <div
                      className={`${selectedStatusTheme?.colors?.subTexts} font-bold  `}
                    >
                      {data?.projectOverAllSituation}
                    </div>
                  </div>
                </div>
                <div className="statusImage -z-10  text-right">
                  <img
                    className="h-[65%] md:h-3/4 lg:h-[125%] select-none absolute  -top-16 -right-20 transform -translate-x-0 -translate-y-6 "
                    src={`${
                      data?.projectOverAllSituation ===
                      OverAllTrackEnumValue.SUNNY
                        ? Sunny
                        : data?.projectOverAllSituation ===
                          OverAllTrackEnumValue.CLOUDY
                        ? Cloudy
                        : data?.projectOverAllSituation ===
                          OverAllTrackEnumValue.RAINY
                        ? Rainy
                        : data?.projectOverAllSituation ===
                          OverAllTrackEnumValue.STORMY
                        ? Stormy
                        : ""
                    }`}
                  />
                </div>
              </div>
            </div>
            <h2 className="font-medium text-3xl leading-normal text-gray-600">
              Project Budget
            </h2>
            <div className="budgetBox w-full h-fit flex flex-col md:flex-row gap-5 justify-center items-center">
              <div className="w-full h-full flex  gap-5 border-2 border-gray-500 rounded-2xl p-3">
                <div className="w-1/2 h-full flex flex-col gap-3 justify-center items-center">
                  <div className="w-full h-full text-center text-base md:text-lg font-semibold">
                    Schedule Trend
                  </div>
                  <div className="w-fit h-fit text-lg md:text-xl font-bold text-gray-500 text-center">
                    <img
                      className="h-10 w-10"
                      src={
                        data?.scheduleTrend === ScheduleAndBudgetTrend.STABLE
                          ? Stable
                          : data?.scheduleTrend ===
                            ScheduleAndBudgetTrend.INCREASING
                          ? Increasing
                          : data?.scheduleTrend ===
                            ScheduleAndBudgetTrend.DECREASING
                          ? Decreasing
                          : ""
                      }
                    ></img>
                  </div>
                </div>
                <div className="w-1/2 h-full flex flex-col gap-3 justify-center items-center">
                  <div className="w-full h-full text-center text-base md:text-lg font-semibold">
                    Budget Trend
                  </div>
                  <div className="w-fit h-fit text-lg md:text-xl font-bold text-gray-500 text-center">
                    <img
                      className="h-10 w-10"
                      src={
                        data?.budgetTrend === ScheduleAndBudgetTrend.STABLE
                          ? Stable
                          : data?.budgetTrend ===
                            ScheduleAndBudgetTrend.INCREASING
                          ? Increasing
                          : data?.budgetTrend ===
                            ScheduleAndBudgetTrend.DECREASING
                          ? Decreasing
                          : ""
                      }
                    ></img>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/4 h-full flex flex-col gap-3 border-2 border-gray-500 rounded-2xl p-3 relative">
                <div className="w-full h-full text-center text-base md:text-lg font-semibold pt-2 ">
                  Cost Performance Index
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="flex gap-1 mr-3 items-center absolute top-2 right-0">
                        <img
                          src={InfoCircle}
                          className="h-[16px] w-[16px]"
                          alt="InfoCircle"
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm">
                          CPI measures the project’s cost efficiency: CPI&gt;1:
                          Project is under budget; CPI &lt; 1: Project is over
                          budget; CPI=1: Project is on budget SPI measures how
                          closely your project follows the schedule : SPI &gt;
                          1: Project is ahead of schedule; SPI &lt; 1: Project
                          is behind schedule; SPI = 1
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div
                  className={`w-full h-full text-lg md:text-xl font-bold text-gray-500 text-center ${
                    Number(data.cpi) < 0.8
                      ? "text-red-700/60"
                      : Number(data.cpi) >= 0.8 && Number(data.cpi) < 0.95
                      ? "text-orange-400/80"
                      : Number(data.cpi) >= 0.95
                      ? "text-green-700/60"
                      : ""
                  }`}
                >
                  {Number(data.cpi).toFixed(2)}
                </div>
              </div>
              <div className="w-full md:w-1/4 h-full flex flex-col gap-3 border-2 border-gray-500 rounded-2xl p-3 relative">
                <div className="w-full h-full text-center text-base md:text-lg font-semibold pt-2">
                  Schedule Performance Index
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="flex gap-1 mr-3 items-center absolute top-2 right-0">
                        <img
                          src={InfoCircle}
                          className="h-[16px] w-[16px]"
                          alt="InfoCircle"
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm">
                          SPI measures how closely your project follows the
                          schedule : SPI &gt; 1: Project is ahead of schedule;
                          SPI &lt; 1: Project is behind schedule; SPI = 1
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div
                  className={`w-full h-full text-lg md:text-xl font-bold text-gray-500 text-center ${
                    Number(getSPI()) < 0.8
                      ? "text-red-700/60"
                      : Number(getSPI()) >= 0.8 && Number(getSPI()) < 0.95
                      ? "text-orange-400/80"
                      : Number(getSPI()) >= 0.95
                      ? "text-green-700/60"
                      : ""
                  }`}
                >
                  {getSPI()}
                </div>
              </div>
              <div className="w-full md:w-1/4 h-full flex flex-col gap-3 border-2 border-gray-500 rounded-2xl p-3">
                <div className="w-full h-full text-center text-base md:text-lg font-semibold ">
                  Estimated Project Budget
                </div>
                <div className="w-full h-full text-lg md:text-xl font-bold text-gray-500 text-center">
                  {data?.estimatedBudget}
                </div>
              </div>
              <div className="w-full md:w-1/4  h-full flex flex-col gap-3 border-2 border-gray-500 rounded-2xl p-3">
                <div className="w-full h-full text-center text-base md:text-lg font-semibold ">
                  Consumed Project Budget
                </div>
                <div className="w-full h-full text-lg md:text-xl font-bold text-gray-500 text-center">
                  {data?.consumedBudget}
                </div>
              </div>
            </div>
            {data.keyPerformanceIndicator && (
              <div className="w-full h-full flex flex-col md:flex-row items-center justify-center gap-0 md:gap-5">
                <div className="w-full  text-center text-base md:text-lg font-semibold flex flex-col gap-2 border-b-2 border-primary-200 md:border-b-0 p-[10px] md:p-0">
                  <div>Re-calculated Budget</div>
                  <div className="text-lg md:text-xl font-bold text-gray-500">
                    {data.keyPerformanceIndicator.reCalculateBudget ?? "N/A"}
                  </div>
                </div>
                <div className="w-full  text-center text-base md:text-lg font-semibold flex flex-col gap-2 border-b-2 border-primary-200 md:border-b-0 p-[10px] md:p-0">
                  <div> Budget variation</div>
                  <div className="text-lg md:text-xl font-bold text-gray-500">
                    {data.keyPerformanceIndicator.budgetVariation ?? "N/A"}
                  </div>
                </div>
                <div className="w-full  text-center text-base md:text-lg font-semibold flex flex-col gap-2 border-b-2 border-primary-200 md:border-b-0 p-[10px] md:p-0">
                  <div> Re-calculated End date</div>
                  <div className="text-lg md:text-xl font-bold text-gray-500">
                    {data.keyPerformanceIndicator.reCalculateEndDate &&
                      dateFormater(
                        new Date(
                          data.keyPerformanceIndicator.reCalculateEndDate
                        ) ?? "N/A"
                      )}
                  </div>
                </div>
                <div className="w-full  text-center text-base md:text-lg font-semibold flex flex-col gap-2 border-b-2 border-primary-200 md:border-b-0 p-[10px] md:p-0">
                  <div>Duration variation</div>
                  <div className="text-lg md:text-xl font-bold text-gray-500">
                    {data.keyPerformanceIndicator.reCalculatedDuration +
                      " Days" ?? "N/A"}
                  </div>
                </div>
              </div>
            )}
            <div className="font-medium text-3xl leading-normal text-gray-600">
              Tasks Indicators
            </div>
            <div className="taskCharts w-full h-fit flex flex-col md:flex-row justify-center items-center gap-6 py-2 ">
              <div
                className={`${selectedStatusTheme?.colors.chartGradient} ${selectedStatusTheme?.colors.chartBorders} rounded-2xl w-full md:w-1/2 h-[25rem] justify-center items-center flex gap-2 `}
              >
                {barChartProp ? <PieChart chartProps={barChartProp} /> : <></>}
              </div>
              <div
                className={` ${selectedStatusTheme?.colors.chartGradient} ${selectedStatusTheme?.colors.chartBorders} rounded-2xl w-full md:w-1/2 h-[25rem] justify-center items-center flex gap-2  `}
              >
                {statusPieChartProp ? (
                  <PieChart chartProps={statusPieChartProp} />
                ) : (
                  <></>
                )}
              </div>
              {/* <div className="risks rounded-2xl w-3/4 lg:w-1/4 h-full justify-center items-center  flex gap-2 backdrop-filter backdrop-blur-md bg-opacity-60 border border-gray-300">
            <HorizontalBarChart chartProps={} />
          </div> */}
            </div>
          </div>
        </>
      )}
    </>
  );
}
export default ProjectDashboard;
