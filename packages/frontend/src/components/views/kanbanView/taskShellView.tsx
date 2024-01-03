import { UserOrganisationType } from "@/api/query/useOrganisationDetailsQuery";
import UserAvatar from "@/components/ui/userAvatar";
import dateFormater from "@/helperFuntions/dateFormater";
import { Progress } from "@/components/ui/progress";
import { KanbanDataSource } from "smart-webcomponents-react";
interface Props {
  taskData: KanbanDataSource & { users: string | undefined; subTask: number };
}
function TaskShellView(props: Props) {
  const users: UserOrganisationType[] = JSON.parse(
    props.taskData?.users ?? "[]"
  );
  return (
    <div className="w-full h-full">
      <div className="flex justify-between w-full">
        <div className="text-lg text-gray-500">{props.taskData?.text}</div>
        <div className="w-20 grid grid-cols-[repeat(auto-fit,minmax(10px,max-content))]">
          {users.slice(0, 3).map((item, index) => {
            const zIndex = Math.abs(index - 2);
            return (
              <div key={index} style={{ zIndex: zIndex }}>
                <UserAvatar
                  className="shadow-sm shadow-gray-300"
                  user={item.user}
                ></UserAvatar>
              </div>
            );
          })}
          <div>{users && users?.length > 3 ? `${users.length - 3} +` : ""}</div>
        </div>
      </div>
      <div className="w-full my-5">
        <Progress
          value={props.taskData.progress ?? 0}
          className="w-full mt-3"
        />
      </div>
      <div className="flex justify-between">
        {props.taskData?.dueDate && (
          <div>{dateFormater(props.taskData?.dueDate)}</div>
        )}
        <div>Sub Task : {props.taskData?.subTask}</div>
      </div>
    </div>
  );
}

export default TaskShellView;
