import { useState } from "react";
import AddProjectIcon from "../../assets/svg/AddProjectIcon.svg";
import downArrow from "../../assets/svg/DownArrow.svg";
import RightSide from "../../assets/RightSide.png";
import LeftSide from "../../assets/Left.png";

export type SideBarProps = {
  toggleSidebar: () => void;
  isSidebarExpanded: boolean;
};

function SideBar({ toggleSidebar, isSidebarExpanded }: SideBarProps) {
  const [isSelected, setIsSelected] = useState(1);

  const handleClick = (id: number) => {
    setIsSelected(id);
  };

  const handleSidebarClick = () => {
    if (!isSidebarExpanded) {
      toggleSidebar();
    }
  };

  const sidebarData = [
    {
      id: 1,
      ProjectName: "Project",
    },
    {
      id: 2,
      ProjectName: "Test",
    },
    {
      id: 3,
      ProjectName: "Demo",
    },
  ];

  return (
    <div
      className={`bg-white border-r-2 border-primary-400 h-screen fixed   ${
        isSidebarExpanded ? "md:w-64" : "w-0  pl-4 "
      } overflow-hidden `}
      onClick={handleSidebarClick}
    >
      <button
        onClick={toggleSidebar}
        className={`fixed top-16  w-6 h-6 z-10  text-black  ${
          isSidebarExpanded
            ? "md:left-52 left-36"
            : "left-1 rounded-full bg-primary-100 flex justify-center items-center"
        } `}
      >
        {isSidebarExpanded ? (
          <div>
            <img src={LeftSide} className="w-2 h-2 flex items-center" />
          </div>
        ) : (
          <div>
            <img src={RightSide} className="w-4 h-4 flex items-center" />
          </div>
        )}
      </button>
      <div className="p-4">
        <div className="mt-24 flex justify-between">
          <div className="text-xs text-primary-900 font-medium">Projects</div>
          <div className="w-6 h-6 rounded-md bg-slate-400">
            <img
              src={AddProjectIcon}
              className="justify-center w-full h-full flex p-1"
            ></img>
          </div>
        </div>
        <div className="max-h-[500px] overflow-y-auto">
          {sidebarData.map((item, index) => {
            return (
              <div
                onClick={() => handleClick(item.id)}
                className={`mt-5 flex justify-between items-center p-1 ${
                  isSelected === item.id
                    ? "rounded-md bg-primary-100 text-[#0C66E4]"
                    : "text-primary-900"
                }`}
                key={index}
              >
                <div className="flex gap-[10px] items-center">
                  <div className="w-6 h-6 rounded-md bg-slate-400">
                    <div className="flex justify-center items-center text-white">
                      {item.ProjectName.charAt(0)}
                    </div>
                  </div>

                  <div className="text-sm font-normal cursor-pointer">
                    {item.ProjectName}
                  </div>
                </div>
                <div>
                  <img src={downArrow}></img>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SideBar;
