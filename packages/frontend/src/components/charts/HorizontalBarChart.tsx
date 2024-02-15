import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
// export type chartDataType = { value: number; name: string }
export type ChartProps = {
  chartData: { value: number; name: string }[];
  color: string[];
  title: string;
  radius: string[];
  height: string;
};
interface HorizontalBarChartProps {
  chartProps: ChartProps;
}
const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({
  chartProps,
}) => {
  const chartref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const myChart = echarts.init(chartref.current as HTMLDivElement);
    const labelRight = {
      position: 'right',
    } as const;

    const option: echarts.EChartsOption = {
      color: chartProps.color,
      grid: {
        bottom: 30,
        top: 80,
      },
      series: [
        {
          data: [
            { label: labelRight, value: 0 },
            { label: labelRight, value: 0 },
            0,
          ],
          label: {
            formatter: '{b}',
            show: true,
          },
          name: 'Cost',
          stack: 'Total',
          type: 'bar',
        },
      ],
      title: {
        left: 'center',
        text: chartProps.title,
        top: '2%',
      },
      tooltip: {
        axisPointer: {
          type: 'shadow',
        },
        trigger: 'axis',
      },
      xAxis: {
        position: 'top',
        splitLine: {
          lineStyle: {
            type: 'dashed',
          },
        },
        type: 'value',
      },
      yAxis: {
        axisLabel: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        data: ['low', 'high', 'medium'],
        splitLine: { show: false },
        type: 'category',
      },
    };
    myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, [chartProps]);

  return (
    <div ref={chartref} style={{ height: chartProps?.height, width: '100%' }} />
  );
};
export default HorizontalBarChart;
