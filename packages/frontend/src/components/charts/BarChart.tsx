import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

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
      grid: {
        bottom: 30,
        top: 80,
      },
      series: [
        {
          data: chartProps?.chartData,
          label: {
            formatter: '{b}',
            show: true,
          },
          name: 'Delay',
          stack: 'Total',
          type: 'bar',
        },
      ],
      title: {
        left: 'center',
        text: chartProps?.title,
        textStyle: { color: '#000000' },
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
        data: ['Red', 'Green', 'Orange'],
        splitLine: { show: false },
        type: 'category',
      },
    };

    myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, [chartProps]);

  return <div ref={chartref} style={{ height: '500px', width: '100%' }} />;
};
export default BarChart;
