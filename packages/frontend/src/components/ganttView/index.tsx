import GanttChart ,{GanttChartProps} from "smart-webcomponents-react/ganttchart";

function GanttView(props:GanttChartProps) {
  return (
    <div className="h-full w-full">
      <GanttChart
        dataSource={props.dataSource}
        taskColumns={props.taskColumns}
        treeSize={props.treeSize}
        durationUnit={props.durationUnit}
        monthScale="day"
        monthFormat="firstTwoLetters"
        id="gantt"
      ></GanttChart>
    </div>
  );
}

export default GanttView;
