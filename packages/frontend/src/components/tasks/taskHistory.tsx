import { useState } from 'react';
import Clock from '../../assets/svg/Clock.svg';
import UserAvatar from '../ui/userAvatar';
import calculateTimeDifference from '../shared/TimeDifferenceCalculate';
import { Task } from '@/api/mutation/useTaskCreateMutation';
import dateFormater from '@/helperFuntions/dateFormater';

function TaskHistory(props: { task: Task | undefined }) {
  const [showAll, setShowAll] = useState<boolean>(false);

  function isValidDate(dateString: string) {
    const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
    return regex.test(dateString);
  }

  const messageCreate = (history: Task['histories'][0]): string => {
    let { message } = history;
    if (history.data.newValue && history.data.oldValue) {
      if (
        isValidDate(history.data.newValue) &&
        isValidDate(history.data.oldValue)
      ) {
        message =
          dateFormater(new Date(history.data.newValue)) +
          ' ' +
          message +
          ' to ' +
          dateFormater(new Date(history.data.oldValue));
      } else {
        message =
          history.data.newValue +
          ' ' +
          message +
          ' to ' +
          history.data.oldValue;
      }
    } else if (isValidDate(history.data.newValue)) {
      message = dateFormater(new Date(history.data.newValue)) + ' ' + message;
    } else {
      message =
        (history.data.oldValue ?? history.data.newValue) + ' ' + message;
    }
    return message;
  };

  return (
    <div>
      <div>
        <div className="flex items-center gap-2.5 mt-4">
          <img src={Clock} width={20} height={20} />
          <div>
            <div className="text-xl font-medium">History</div>
          </div>
        </div>
      </div>
      <div>
        {props.task?.histories
          .slice(0, showAll ? props.task?.histories.length - 1 : 7)
          .map((history) => {
            return (
              <div className="flex gap-3 items-center mt-3">
                <UserAvatar user={history.createdByUser} />
                <div>
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold w-full flex gap-2 items-center">
                      {history.createdByUser.firstName &&
                      history.createdByUser.lastName
                        ? history.createdByUser.firstName +
                          ' ' +
                          history.createdByUser.lastName
                        : history.createdByUser.email}
                      <p className="text-gray-400 text-xs">
                        {calculateTimeDifference(new Date(history.createdAt))}
                      </p>
                    </p>
                    <p className="text-xs text-gray-400 font-semibold w-full">
                      {messageCreate(history)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      <div>
        {props.task?.histories && props.task?.histories.length > 7 && (
          <div>
            <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700"></hr>
            <div
              className="text-center cursor-pointer"
              onClick={() => setShowAll((prev) => !prev)}
            >
              {!showAll ? 'Show all' : 'Less'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskHistory;
