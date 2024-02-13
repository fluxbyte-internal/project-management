import React, {useEffect, useRef} from 'react'; 
import * as echarts from 'echarts';
// export type chartDataType = { value: number; name: string }
export type ChartProps = {
  chartData: { value: number; name: string }[],
  color:string[],
  title: string,
  radius: string[],
  height: string
}
interface HorizontalBarChartProps {
  chartProps: ChartProps
}
const HorizontalBarChart:  React.FC<HorizontalBarChartProps> = ({ chartProps }) =>{
  const chartref = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const myChart = echarts.init(chartref.current as HTMLDivElement);
    const labelRight = {
      position: 'right',
    } as const;
      
    const option:echarts.EChartsOption = {
      color: chartProps.color,
      title: {
        text: chartProps.title,
        top:'2%',
        left:"center",
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        top: 80,
        bottom: 30,
      },
      xAxis: {
        type: 'value',
        position: 'top',
        splitLine: {
          lineStyle: {
            type: 'dashed',
          },
        },
      },
      yAxis: {
        type: 'category',
        axisLine: { show: false },
        axisLabel: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        data: [
          'low',
          'high',
          'medium',
        ],
      },
      series: [
        {
          name: 'Cost',
          type: 'bar',
          stack: 'Total',
          label: {
            show: true,
            formatter: '{b}',
          },
          data: [
            { value: 0, label: labelRight },
            { value: 0, label: labelRight },
            0,
          ],
        },
      ],
    };
    myChart.setOption(option);

    return()=>{
      myChart.dispose();
    };
  },[chartProps]);

  return <div ref={chartref} style={{width: '100%', height: chartProps?.height}} />;
    
};
export default HorizontalBarChart;