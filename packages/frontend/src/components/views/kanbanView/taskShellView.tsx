import DiamondIcon from '../../../assets/svg/DiamondIcon.svg';
import ParentTaskIcon from '../../../assets/svg/ParentTaskIcon.svg';
import { ExtendedKanbanDataSource } from './index';
import { UserOrganisationType } from '@/api/query/useOrganisationDetailsQuery';
import UserAvatar from '@/components/ui/userAvatar';
import dateFormater from '@/helperFuntions/dateFormater';
import PercentageCircle from '@/components/shared/PercentageCircle';

function TaskShellView(props: { taskData: ExtendedKanbanDataSource }) {
  const users: UserOrganisationType[] = JSON.parse(
    props.taskData?.users ?? '[]',
  );
  // function getRandomArbitrary() {
  //   return Math.round(Math.random() * (4-0) + 0);
  // }
  const colors = [
    'bg-[#E9F2FF]',
    'bg-[#FFE9E9]',
    'bg-[#F9E9FF]',
    'bg-[#E9FFEE]',
  ];

  return (
    <div
      className={`w-full h-full px-2 py-1.5 border rounded-md shadow-sm border-l-4  ${
        props.taskData?.color === '#008000'
          ? 'border-l-green-500/60'
          : props.taskData?.color === '#FF0000'
            ? 'border-l-red-500/60'
            : props.taskData?.color === '#FF0000'
              ? 'border-l-primary-500/60'
              : ''
      }`}
    >
      <div className="flex justify-between w-full">
        <div className="text-lg text-gray-500 flex gap-1">
          {props.taskData.subTask > 0 && (
            <img src={ParentTaskIcon} className="w-3 h-3 mt-2 rotate-90" />
          )}
          <div className=" w-[18ch]  truncate">{props.taskData?.text}</div>
          {props.taskData.mileStone && (
            <img src={DiamondIcon} className="w-3 h-3 mt-2" />
          )}
        </div>
        <div className="h-0">
          <PercentageCircle percentage={props.taskData.progress ?? 0} />
        </div>
      </div>
      <div className="w-full my-3">
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
              {`${users.length - 3}+`}
            </div>
          )}
        </div>
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
