import { KanbanDataSource } from "smart-webcomponents-react";
import profile from "../../../assets/profile.svg";
//
interface Props {
  taskData: KanbanDataSource & { picture: string | undefined };
}
function TaskView(props: Props) {
  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-lg"> {props.taskData.text}</h2>
        <img
          src={props.taskData.picture || profile}
          width={30}
          height={30}
          className="rounded-full"
        />
      </div>
      <div >
        <button
          type="button"
          onClick={() => console.log(props.taskData.status, "from component")}
          className="mr-2 text-white p-2 rounded  leading-none flex items-center"
          style={{ background: props.taskData.color, }}
        >
          New
        </button>
      </div>
      
    </div>
  );
}

export default TaskView;
