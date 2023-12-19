import TaskSubTaskForm from "@/components/tasks/taskSubTaskForm";
import { useParams } from "react-router-dom";

function Tasks() {
  const { projectId } = useParams();
  const close = () => {};
  return (
    <div>
      <TaskSubTaskForm taskId="c04d96bb-8210-4b58-bc6b-998cd164345d" projectId={projectId} close={close} />
    </div>
  );
}

export default Tasks;
