import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

export type BarChartPropsType = {
  chartData: { value: number; itemStyle: { color: string } }[];
  title: string;
};

interface BarChartProps {
  chartProps: BarChartPropsType;
}
const BarChart: React.FC<BarChartProps> = ({ chartProps }) => {
  const chartref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const myChart = echarts.init(chartref.current as HTMLDivElement);
    const option: echarts.EChartsOption = {
      title: {
        text: chartProps?.title,
        textStyle: { color: "#000000" },
        left: "center",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        top: 80,
        bottom: 30,
      },
      xAxis: {
        type: "value",
        position: "top",
        splitLine: {
          lineStyle: {
            type: "dashed",
          },
        },
      },
      yAxis: {
        type: "category",
        axisLine: { show: false },
        axisLabel: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        data: ["Red", "Green", "Orange"],
      },
      series: [
        {
          name: "Delay",
          type: "bar",
          stack: "Total",
          label: {
            show: true,
            formatter: "{b}",
          },
          data: chartProps?.chartData,
        },
      ],
    };

    myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, [chartProps]);

  return <div ref={chartref} style={{ width: "100%", height: "500px" }} />;
};
export default BarChart;
