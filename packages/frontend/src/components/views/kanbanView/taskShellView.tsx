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
  // function getRandomArbitrary() {
  //   return Math.round(Math.random() * (4-0) + 0);
  // }
  const colors =[
    "bg-[#E9F2FF]",
    "bg-[#FFE9E9]",
    "bg-[#F9E9FF]",
    "bg-[#E9FFEE]",
  ];
  return (
    <div className="w-full h-full">
      <div className="flex justify-between w-full">
        <div className="text-lg text-gray-500">{props.taskData?.text}</div>
        <div className="w-24 grid grid-cols-[repeat(auto-fit,minmax(10px,max-content))] mr-2">
          {users.slice(0, 3).map((item, index) => {
            const zIndex = Math.abs(index - 2);
            return (
              <>
                <div key={index} style={{ zIndex: zIndex }}>
                  <UserAvatar
                    className={`shadow-sm ${colors[zIndex]}`}
                    user={item.user}
                  ></UserAvatar>
                </div>
              </>
            );
          })}
          {users && users?.length > 3 && (
            <div className="bg-gray-200/30 w-8  text-lg font-medium h-8 rounded-full flex justify-center items-center">
              {`${users.length-3}+`}
            </div>
          )}
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
