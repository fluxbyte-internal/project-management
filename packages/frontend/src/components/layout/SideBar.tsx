import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Tooltip } from '@radix-ui/react-tooltip';
import AddProjectIcon from '../../assets/svg/AddProjectIcon.svg';
import downArrow from '../../assets/svg/DownArrow.svg';
import RightSide from '../../assets/RightSide.png';
import { Button } from '../ui/button';
import useProjectQuery from '@/api/query/useProjectQuery';
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import CreateUpdateProjectForm from '@/components/project/CreateProjectForm';
import { useUser } from '@/hooks/useUser';

export type SideBarProps = {
  toggleSidebar: () => void;
  isSidebarExpanded: boolean;
};

function SideBar({ isSidebarExpanded, toggleSidebar }: SideBarProps) {
  const { id } = useParams();
  const [isSelected, setIsSelected] = useState<string | undefined>(id);

  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isProjectCreate, setProjectCreate] = useState(false);
  const { user } = useUser();

  const navigate = useNavigate();
  const projectQuery = useProjectQuery();

  const handleDropdownClick = (id: string) => {
    if (isOpen && isSelected === id) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
      setIsSelected(id);
    }
  };
  const handleClick = (id: string) => {
    setIsSelected(id);
    navigate('/project-details/' + id);
  };
  const handleTask = (id: string) => {
    setIsSelected(id);
    navigate('/tasks/' + id);
  };
  const handleSidebarClick = () => {
    if (!isSidebarExpanded) {
      toggleSidebar();
    }
  };

  return (
    <>
      <div
        className={`bg-white border-r-2 border-primary-400 h-screen fixed z-10 ${
          isSidebarExpanded ? 'md:w-64 w-[95%] z-10 md:z-0 ' : 'w-0 pl-4 '
        } overflow-hidden `}
        onClick={handleSidebarClick}
      >
        <button
          onClick={toggleSidebar}
          className={`fixed top-16 w-6 h-6 z-10 text-black bg-primary-100 rounded-full  flex justify-center items-center ${
            isSidebarExpanded ? 'md:left-60 right-6' : 'left-1'
          } `}
        >
          <img
            src={RightSide}
            className={`w-4 h-4 flex items-center ${
              isSidebarExpanded ? 'rotate-180' : 'rotate-0'
            }`}
          />
        </button>
        <div className="py-4 px-2">
          <div className="mt-12 flex justify-between">
            <div className="text-base text-[#44546F] font-medium">Projects</div>
            {user?.userOrganisation[0]?.role !== 'TEAM_MEMBER' && (
              <Button
                variant={'secondary'}
                className="w-6 h-6 p-0 rounded-md"
                onClick={() => setProjectCreate(true)}
              >
                <div>
                  <img
                    src={AddProjectIcon}
                    className="justify-center w-full h-full flex p-1"
                  />
                </div>
              </Button>
            )}
          </div>
          <div className="max-h-[500px] overflow-y-auto">
            {projectQuery.data?.data.data.map((item, index) => (
              <div key={index}>
                <div
                  className={`mt-2 flex justify-between items-center p-1 ${
                    isSelected === item.projectId
                      ? 'rounded-md bg-gray-100 text-gray-900 font-semibold'
                      : 'text-gray-500 font-medium'
                  }`}
                  onClick={() => handleDropdownClick(item.projectId)}
                >
                  <div className="flex gap-[10px] items-center grow">
                    <div
                      className={`w-6 h-6 rounded-md shrink-0 ${
                        index % 2 === 0
                          ? 'bg-gradient-to-b from-[#0C66E4] to-[#227D9B]'
                          : 'bg-gradient-to-b from-[#1F845A] to-[#4BCE97]'
                      }`}
                    >
                      <div className="flex justify-center items-center text-white capitalize">
                        {item.projectName.charAt(0)}
                      </div>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="text-sm cursor-pointer grow line-clamp-1">
                            {item.projectName}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-sm"> {item.projectName}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="cursor-pointer w-4 h-4 shrink-0">
                    <img
                      src={downArrow}
                      alt="Toggle Dropdown"
                      className={`h-full w-full ${
                        isSelected === item.projectId && isOpen
                          ? 'rotate-180'
                          : 'rotate-0'
                      }`}
                    />
                  </div>
                </div>
                <div className="flex justify-center mt-1">
                  {isSelected === item.projectId && isOpen && (
                    <div className="w-full flex flex-col gap-2 justify-center px-4 py-2">
                      <div
                        className="cursor-pointer text-sm font-medium text-gray-700 p-1 rounded-md px-4 hover:bg-slate-100/80"
                        onClick={() => handleClick(item.projectId)}
                      >
                        Details
                      </div>
                      <div
                        className="cursor-pointer text-sm font-medium text-gray-700 p-1 rounded-md px-4 hover:bg-slate-100/80"
                        onClick={() => handleTask(item.projectId)}
                      >
                        Project Task
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {isProjectCreate && user?.userOrganisation[0].role !== 'TEAM_MEMBER' && (
        <CreateUpdateProjectForm
          handleClosePopUp={() => setProjectCreate(false)}
        ></CreateUpdateProjectForm>
      )}
    </>
  );
}

export default SideBar;
