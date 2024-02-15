import { useState } from 'react';
import organisationImage from '../../assets/png/organisation.png';
import BackgroundImage from '../../components/layout/BackgroundImage';
import TaskSubTaskForm from '@/components/tasks/taskSubTaskForm';

type Props = { projectId: string; refetch: () => void };
function NoTask(props: Props) {
  const [isOpenPopUp, setIsOpenPopUp] = useState(false);
  const close = () => {
    setIsOpenPopUp(false);
    props.refetch();
  };
  return (
    <>
      <BackgroundImage />
      <div
        className={`w-full px-5 h-full flex overflow-auto justify-center items-center`}
      >
        <div className="flex flex-col m-auto justify-center items-center gap-24">
          <div className="p-6">
            <img src={organisationImage} className="w-96" />
          </div>
          <div className="lg:flex justify-between gap-x-5 w-full">
            <div>
              <span className="text-gray-400 text-2xl sm:text-3xl font-medium font-['Poppins']">
                Don’t have any Task?
                <br />
              </span>
              <span className="text-neutral-600 text-5xl font-bold">
                Create One!
              </span>
            </div>
            <div className="flex items-center ">
              <button
                onClick={() => setIsOpenPopUp(true)}
                className="w-full mt-3 tracking-wide lg:mt-0 lg:w-fit bg-warning hover:bg-opacity-80 text-lg font-medium text-orange-800 py-3 px-7 rounded-md gap-4"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
      {isOpenPopUp && (
        <TaskSubTaskForm taskId="" projectId={props.projectId} close={close} />
      )}
    </>
  );
}

export default NoTask;
