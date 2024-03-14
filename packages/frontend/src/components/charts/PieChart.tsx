import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { useNavigate, useParams } from "react-router-dom";
import { TaskStatusEnumValue } from "@backend/src/schemas/enums";
// export type chartDataType = { value: number; name: string }
export type ChartProps = {
  chartData: { value: number; name: string }[];
  color: string[];
  title: string;
  subtext?: string;
  radius: string[];
  height: string;
};
interface PieChartProps {
  chartProps: ChartProps;
}
const PieChart: React.FC<PieChartProps> = ({ chartProps }) => {
  const projectId = useParams()?.projectId;
  const navigate = useNavigate();

  const filterRoutes = (key: string, item: string) => {
    navigate(`/tasks/${projectId}?${key}=${item}`);
  };
  const chartref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const myChart = echarts.init(chartref.current as HTMLDivElement);
    const option: echarts.EChartsOption = {
      color: chartProps?.color,
      title: {
        text: chartProps?.title,
        subtext: chartProps?.subtext,
        bottom: "0%",
        left: "center",
        textStyle: { color: "#000000" },
      },
      tooltip: {
        trigger: "item",
        formatter: "{b} {d}% ",
      },
      legend: {
        top: "5%",
        left: "center",
        textStyle: {
          fontSize: 14,
          fontWeight: "bold",
          color: "#000000",
        },
      },
      series: [
        {
          name: "",
          type: "pie",
          radius: chartProps?.radius,
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: "inner",
            formatter: "{c} ",
            fontSize: 14,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: "bolder",
            },
          },
          labelLine: {
            show: false,
          },
          data: chartProps?.chartData,
        },
      ],
    };

    myChart.on("click", (params: any) => {
      if (projectId) {
        if (
          Object.keys(TaskStatusEnumValue).find(
            (d) => d == params.name.toUpperCase().replace(/\s/g, "_")
          )
        ) {
          const status = params.name.toUpperCase().replace(/\s/g, "_");
          filterRoutes("status", status);
        } else {
          filterRoutes(
            "flag",
            params.name == "Significant delay" ? "Red" :params.name == "Moderate delay" ? "Orange" :"Green"
          );
        }
      }
    });
    myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, [chartProps]);

  return (
    <div ref={chartref} style={{ width: "100%", height: chartProps?.height }} />
  );
};
export default PieChart;
