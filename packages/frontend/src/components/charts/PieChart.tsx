import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useNavigate, useParams } from 'react-router-dom';
// export type chartDataType = { value: number; name: string }
export type ChartProps = {
  chartData: { value: number; name: string }[];
  color: string[];
  title: string;
  radius: string[];
  height: string;
};
interface PieChartProps {
  chartProps: ChartProps;
}
const PieChart: React.FC<PieChartProps> = ({ chartProps }) => {
  const projectId = useParams()?.projectId;
  const navigate = useNavigate();

  const filterRoutes = (item: string) => {
    navigate(`/tasks/${projectId}?status=${item}`);
  };
  const chartref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const myChart = echarts.init(chartref.current as HTMLDivElement);
    const option: echarts.EChartsOption = {
      color: chartProps?.color,
      legend: {
        left: 'center',
        textStyle: {
          color: '#000000',
          fontSize: 14,
          fontWeight: 'bold',
        },
        top: '5%',
      },
      series: [
        {
          avoidLabelOverlap: false,
          data: chartProps?.chartData,
          emphasis: {
            label: {
              fontSize: 20,
              fontWeight: 'bolder',
              show: true,
            },
          },
          label: {
            position: 'center',
            show: false,
          },
          labelLine: {
            show: false,
          },
          name: '',
          radius: chartProps?.radius,
          type: 'pie',
        },
      ],
      title: {
        bottom: '4%',
        left: 'center',
        text: chartProps?.title,
        textStyle: { color: '#000000' },
      },
      tooltip: {
        trigger: 'item',
      },
    };

    myChart.on('click', (params: any) => {
      if (projectId) {
        filterRoutes(params.name);
      }
    });
    myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, [chartProps]);

  return (
    <div ref={chartref} style={{ height: chartProps?.height, width: '100%' }} />
  );
};
export default PieChart;
