import TaskSubTaskForm from "@/components/tasks/taskSubTaskForm";
import { useParams } from "react-router-dom";

function Tasks() {
  const { projectId } = useParams();
  const close = () => {};
  return (
    <div>
      <TaskSubTaskForm taskId="" projectId={projectId} close={close} />
    </div>
  );
}

export default Tasks;
