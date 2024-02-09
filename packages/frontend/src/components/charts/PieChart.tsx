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
interface PieChartProps {
  chartProps: ChartProps
}
const PieChart:  React.FC<PieChartProps> = ({ chartProps }) =>{
  const chartref = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const myChart = echarts.init(chartref.current as HTMLDivElement);
    const option:echarts.EChartsOption = {
      color: chartProps?.color,
      title:{ 
        text:chartProps?.title,
        bottom: '4%',
        left: 'center',
        textStyle: {color:'#000000'},
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        top: '5%',
        left: 'center',
        textStyle:{
          fontSize : 14,
          fontWeight : 'bold',
          color: '#000000',
        },
      },
      series: [
        {
          name: '',
          type: 'pie',
          radius: chartProps?.radius,
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: 'bolder',
            },
          },
          labelLine: {
            show: false,
          },
          data:chartProps?.chartData,
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
export default PieChart;