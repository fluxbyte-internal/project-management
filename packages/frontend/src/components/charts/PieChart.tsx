import React, {useEffect, useRef} from 'react'; 
import * as echarts from 'echarts';
import { useNavigate, useParams } from 'react-router-dom';
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
  const projectId = useParams()?.projectId;
  const navigate = useNavigate();

  const filterRoutes = (item: string) => {
    const status = item.toUpperCase().replace(/\s/g, '_');
    navigate(`/tasks/${projectId}?status=${status}`);
  };
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
    
    myChart.on('click', (params: any) => {
      if (projectId) {
        filterRoutes(params.name);
      }
    });
    myChart.setOption(option);

    return()=>{
      myChart.dispose();
    };
  },[chartProps]);

  return <div ref={chartref} style={{width: '100%', height: chartProps?.height}} />;
    
};
export default PieChart;