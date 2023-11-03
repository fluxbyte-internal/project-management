import React from "react";
import { Scheduler, SchedulerProps } from "smart-webcomponents-react/scheduler";
function CalenderView(props: SchedulerProps) {
  return (
    <div className="h-full w-full">
      <Scheduler id="scheduler" dataSource={props.dataSource} />
    </div>
  );
}

export default CalenderView;
