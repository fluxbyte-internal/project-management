import useProjectDashboardQuery, {
  projectDashboardPortfolioDataType,
} from "@/api/query/useProjectDashboardQuery";
import PieChart, { ChartProps } from "@/components/charts/PieChart";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import dateFormatter from "@/helperFuntions/dateFormater";
import BarChart, { BarChartPropsType } from "@/components/charts/BarChart";
import Sunny from "@/assets/png/Sunny.png";
import Cloudy from "@/assets/png/Cloudy.png";
import Rainy from "@/assets/png/Rainy.png";
import Stormy from "@/assets/png/Stormy.png";

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
  const [barChartProp, setBarChartProp] = useState<BarChartPropsType>();
  const projectId = useParams()?.projectId;
  const projectDashboardQuery =useProjectDashboardQuery(projectId);

  const colorThemeArr: ThemeColorData[] = [
    {
      theme: "SUNNY",
      colors: {
        tabTexts: "text-white",
        tabGradient: "bg-gradient-to-r  from-primary-500 to-primary-300",
        tabBorders: "border-primary-900 ",
        mainTexts: "text-primary-800",
        subTexts: "text-primary-800",
        chartColors: ["#FFD04A", "#FFB819", "#943B0C"],
        chartGradient: "",
        chartBorders: "border border-gray-500",
        chartHeadingTexts: "#000000",
      },
    },
    {
      theme: "CLOUDY",
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
      theme: "RAINY",
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
      theme: "STORMY",
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
    if(data && colorThemeArr ){
      const statusThemeData = colorThemeArr.find((key) => key?.theme === data?.projectOverAllSituation );
 
      setSelectedStatusTheme(statusThemeData);
    }
  };

  useEffect(() => {
    setData(projectDashboardQuery?.data?.data?.data);
  
  }, [projectDashboardQuery?.data?.data?.data]);

  useEffect(() => {
    setTheme();

  }, [data]);
  useEffect(()=>{
    if(selectedStatusTheme){

      const statusPieChartData = data?.taskStatusChartData?.labels.map(
        (name, index) => ({
          value: Number(data?.taskStatusChartData?.data[index]) ,
          name,
        })
      );
      if(statusPieChartData){
  
        setstatusPieChartProp({

          chartData:  statusPieChartData  ,
          color: selectedStatusTheme?.colors.chartColors,
          title: "Task Per Status",
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
            itemStyle: { color: selectedStatusTheme?.colors?.chartColors[2] },
          },
          {
            value: delayCounts.green,
            itemStyle: { color: selectedStatusTheme?.colors?.chartColors[1] },
          },
          {
            value: delayCounts.orange,
            itemStyle: { color: selectedStatusTheme?.colors?.chartColors[0] },
          },
        ],
        title: "Task Delays",
      });

    }
  },[selectedStatusTheme]);
  return (
    <>{selectedStatusTheme && data && (
      <>
        <div className="overflow-auto w-full self-center py-2 mt-10 px-5 lg:px-24 flex flex-col gap-10">
          <h2 className="font-medium text-3xl leading-normal text-gray-600">
          Project Dashboard
          </h2>
          <div className="statsbox w-full h-fit flex flex-col lg:flex-row justify-center items-center gap-6 py-2 ">
            <div
              className={`items-start relative flex-col ${selectedStatusTheme?.colors.tabGradient} ${selectedStatusTheme?.colors.tabTexts} border-l-[12px]  rounded-2xl w-full h-full justify-center px-6 py-3 flex gap-5 backdrop-filter   ${selectedStatusTheme?.colors.tabBorders}  `}
            >
              <div className="text-lg ">No. of Team Members</div>
              <div className="text-4xl font-semibold">58</div>
              <div className="absolute right-3 bottom-3">oo</div>
            </div>

            <div
              className={`items-start relative flex-col ${selectedStatusTheme?.colors.tabTexts} border-l-[12px] ${selectedStatusTheme?.colors.tabGradient} rounded-2xl w-full h-full justify-center px-6 py-3 flex gap-5 backdrop-filter  ${selectedStatusTheme?.colors.tabBorders}`}
            >
              <div className="text-lg ">No. of Tasks</div>
              <div className="text-4xl font-semibold">58</div>
              <div className="absolute right-3 bottom-3">oo</div>
            </div>
            <div
              className={`items-start relative flex-col ${selectedStatusTheme?.colors.tabTexts} border-l-[12px] ${selectedStatusTheme?.colors.tabGradient} rounded-2xl w-full h-full justify-center px-6 py-3 flex gap-5 backdrop-filter  ${selectedStatusTheme?.colors.tabBorders}`}
            >
              <div className="text-lg ">No. of Milestones</div>
              <div className="text-4xl font-semibold">58</div>
              <div className="absolute right-3 bottom-3">oo</div>
            </div>
            <div
              className={`items-start relative flex-col ${selectedStatusTheme?.colors.tabTexts} border-l-[12px] ${selectedStatusTheme?.colors.tabGradient} rounded-2xl w-full h-full justify-center px-6 py-3 flex gap-5 backdrop-filter  ${selectedStatusTheme?.colors.tabBorders}`}
            >
              <div className="text-lg ">No. of Risks</div>
              <div className="text-4xl font-semibold">58</div>
              <div className="absolute right-3 bottom-3">oo</div>
            </div>
          </div>
          <div className="statsbox relative w-full h-fit flex  justify-center items-center  border-2 border-gray-500 rounded-2xl">
            <div className="statsboxDiv w-full h-full overflow-hidden relative flex flex-col sm:flex-col md:flex-row lg:flex-row gap-6  py-2 rounded-2xl">
              <div className="w-full md:w-2/3 flex flex-col sm:flex-col md:flex-row lg:flex-row justify-center items-center gap-6 py-2">
                <div className="w-full flex md:flex-col gap-1 md:gap-6 justify-center items-center py-3">
                  <div className="w-full  text-center text-base md:text-lg font-semibold flex flex-col gap-2 border-r-2 md:border-r-0 md:border-b-2 border-primary-200 md:pb-8">
                    <div>Start Date</div>
                    <div className="text-lg md:text-xl font-bold text-gray-500">
                      {dateFormatter(new Date(data?.projectDates?.startDate))}
                    </div>
                  </div>
                  <div className="w-full  text-center text-base md:text-lg font-semibold flex flex-col gap-2">
                    <div>Est. End Date</div>
                    <div className="text-lg md:text-xl font-bold text-gray-500">
                      {dateFormatter(
                        new Date(data?.projectDates?.estimatedEndDate)
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-5 w-full  text-center ">
                  <div className="text-xl font-semibold">Project Status</div>
                  <div
                    className={`text-4xl font-semibold ${selectedStatusTheme?.colors.mainTexts}`}
                  >
                    {data?.projectStatus}
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/3 h-full">
                <div className="flex flex-col gap-1 md:gap-3 md:pr-10 w-full h-full text-center text-2xl md:text-3xl font-medium items-center justify-center">
                  <div className="text-base md:text-lg ">
                  Project OverAll Status:
                  </div>
                  <div
                    className={`${selectedStatusTheme?.colors.subTexts} font-bold  `}
                  >
                    {data?.projectOverAllSituation}
                  </div>
                </div>
              </div>
              <div className="statusImage absolute -right-[10%] top-[65%] md:-right-[8%] md:-top-[35%] md:w-1/5 w-[30%] h-full text-right">
                <img src={`${data?.projectOverAllSituation === "SUNNY" ? Sunny : (data?.projectOverAllSituation === "CLOUDY" ? Cloudy : (data?.projectOverAllSituation === "RAINY" ? Rainy : (data?.projectOverAllSituation === "STORMY"? Stormy : "")))}`} />
              </div>
            </div>
          </div>
          <div className="font-medium text-3xl leading-normal text-gray-600">
          Tasks's Data
          </div>
          <div className="taskCharts w-full h-fit flex flex-col md:flex-row justify-center items-center gap-6 py-2 ">
            <div
              className={`py-5 ${selectedStatusTheme?.colors.chartGradient} ${selectedStatusTheme?.colors.chartBorders} rounded-2xl w-full md:w-2/3 h-full justify-center items-center flex gap-2 `}
            >
              {barChartProp ? 
                <BarChart chartProps={barChartProp} />
                : <></>
              }
            </div>
            <div
              className={` ${selectedStatusTheme?.colors.chartGradient} ${selectedStatusTheme?.colors.chartBorders} rounded-2xl w-full md:w-1/3 h-full justify-center items-center flex gap-2  `}
            >
              {statusPieChartProp ? 
                <PieChart chartProps={statusPieChartProp} />              
                : <></>
              }
            </div>
          </div>
        </div>
      </>
    )

    }
    
    </>
  );
}
export default ProjectDashboard;
