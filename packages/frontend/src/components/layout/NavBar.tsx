import { useState } from "react";
import DownArrow from "../../assets/svg/DownArrow.svg";
import Notification from "../../assets/svg/Notification.svg";
import Information from "../../assets/svg/Information.svg";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";
import { LogOut } from "lucide-react";

const navbarData = [
  {
    id: 1,
    name: "Projects",
  },
  {
    id: 2,
    name: "Recents",
  },
  {
    id: 3,
    name: "Starred",
  },
] as const;

interface DropDownType {
  [key: number]: boolean;
}

function NavBar() {
  const [isOpenProfileDropDown, setisOpenProfileDropDown,] =
    useState<boolean>(false);
  const [isOpenDropDown, setIsOpenDropDown,] = useState<DropDownType>({});
  const [isMoreDropdownOpen, setIsMoreDropdownOpen,] = useState(false);

  const handleOpenProfileDropDown = () => {
    setisOpenProfileDropDown(!isOpenProfileDropDown);
  };
  const handleOpenMoreDropDown = (id: number) => {
    setIsMoreDropdownOpen(!isMoreDropdownOpen);
    setIsOpenDropDown((prevState) => ({
      [id]: !prevState[id],
    }));
  };
  const handleOpenDropDown = (id: number) => {
    setIsMoreDropdownOpen(false);
    setIsOpenDropDown((prevState) => ({
      [id]: !prevState[id],
    }));
  };
  return (
    <div className="w-full h-14 bg-primary-50 shadow-side z-10  fixed border-b-2 border-primary-200 flex items-center flex-col ">
      <div className="flex items-center w-full h-full justify-between px-3 md:px-28">
        <div className="flex gap-5 justify-between overflow-hidden items-center">
          {navbarData.map((item, index) => {
            return (
              <div
                className={`hidden gap-2 items-center ${
                  item.id === 3 && "lg:flex"
                } ${item.id === 2 && "md:flex"} ${item.id === 1 && "sm:flex"}`}
                key={index}
                onClick={() => handleOpenDropDown(item.id)}
              >
                <div className="text-sm font-medium text-primary-900 relative cursor-pointer">
                  {item.name}
                </div>
                <div className=" w-full  h-full flex items-center aspect-square">
                  <img src={DownArrow}></img>
                </div>

                {isOpenDropDown[item.id] && item.id === 1 && (
                  <div className="w-[200px]  bg-white rounded-md  h-auto absolute top-14   flex border-primary-200 border shadow-md">
                    <div className="p-4">
                      <div className="flex justify-between">
                        <div className=" break-all">Project Content</div>
                        <div>
                          <img src={Information} alt="Information Icon" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {isOpenDropDown[item.id] && item.id === 2 && (
                  <div className="w-[200px]  bg-white rounded-md  h-auto absolute top-14   flex border-primary-200 border shadow-md">
                    <div className="p-4">
                      <div className="flex justify-between">
                        <div className=" break-all">Recents Content</div>
                        <div>
                          <img src={Information} alt="Information Icon" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {isOpenDropDown[item.id] && item.id === 3 && (
                  <div className=" w-[200px]  bg-white rounded-md  h-auto absolute top-14   flex border-primary-200 border shadow-md">
                    <div className="p-4">
                      <div className="flex justify-between items-center">
                        <div className=" break-all">Starred Project</div>
                        <div>
                          <img src={Information} alt="Information Icon" />
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className=" break-all">Starred Project</div>
                        <div>
                          <img src={Information} alt="Information Icon" />
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className=" break-all">Starred Project</div>
                        <div>
                          <img src={Information} alt="Information Icon" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <div className="flex gap-2 items-center lg:hidden">
            <div
              className="text-sm font-medium text-primary-900 cursor-pointer"
              onClick={() => handleOpenMoreDropDown(4)}
            >
              More
            </div>
            <div className=" w-full  h-full flex items-center aspect-square">
              <img src={DownArrow}></img>
            </div>

            {isMoreDropdownOpen && (
              <div className="bg-white rounded-md  h-auto absolute top-14 p-4  flex border-primary-200 border shadow-md">
                <div>
                  {navbarData.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <div
                        className={`flex justify-between text-sm font-medium text-primary-900 relative cursor-pointer ${
                          item.id === 3 && "lg:hidden"
                        } ${item.id === 2 && "md:hidden"} ${
                          item.id === 1 && "sm:hidden"
                        }`}
                        onClick={() => handleOpenDropDown(item.id)}
                        key={item.id}
                      >
                        {item.name}
                        <div className=" flex  aspect-square ">
                          <img src={DownArrow}></img>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:block hidden">
            <Button className="bg-gradient-to-t from-[#227D9B]  to-[#0C66E4] rounded-md px-3 py-2 text-white text-sm font-medium">
              Create
            </Button>
          </div>
          <div className="block lg:hidden">
            <button className="bg-gradient-to-t from-[#227D9B] to-[#0C66E4] rounded-md  text-white text-lg font-medium h-12 w-12">
              <span className="flex justify-center items-center">+</span>
            </button>
          </div>
        </div>
        <div className="flex md:gap-5 gap-2 items-center relative">
          <div className="w-8 h-8 aspect-square  rounded-full bg-primary-400">
            <img
              src={Notification}
              className="w-full h-full justify-center flex p-1"
            ></img>
          </div>

          <div className="w-8 h-8 aspect-square">
            <img src={Information} className="w-full h-full"></img>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div
                className="w-8 h-8 aspect-square rounded-full bg-primary-100 outline-none"
                onClick={handleOpenProfileDropDown}
              >
                <span className="text-blue-500 text-sm font-bold flex justify-center items-center w-full h-full">
                  SA
                </span>
              </div>
            </DropdownMenuTrigger>

            {isOpenProfileDropDown && (
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>

                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
