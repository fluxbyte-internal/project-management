import TaskSubTaskForm from "@/components/tasks/taskSubTaskForm";
import { useParams } from "react-router-dom";

function Tasks() {
  const { projectId } = useParams();
  const close = () => {};
  return (
    <div>
      <TaskSubTaskForm taskId="39ad4fb0-3b64-4798-ac8c-823a4bbbc337" projectId={projectId} close={close} />
    </div>
  );
}

export default Tasks;
